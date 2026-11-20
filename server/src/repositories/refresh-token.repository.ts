import { pool } from '../config/database.js';
import type { RowDataPacket } from 'mysql2/promise';

// Database row returned when looking up a refresh token.
interface RefreshTokenRow extends RowDataPacket {
    id: number;
    userId: number;
    familyId: string;
    revokedAt: Date | null;
    isExpired: number | boolean;
    username: string;
}

interface RefreshFamilyRow extends RowDataPacket {
    family_id: string;
}

// Input for creating a refresh-token record.
interface CreateRefreshTokenInput {
    userId: number;
    familyId: string;
    tokenHash: string;
    expiresAt: string;
}

// Input for rotating a refresh token.
interface RotateRefreshTokenInput {
    currentTokenHash: string;
    newTokenHash: string;
    newExpiresAt: string;
}

// Possible outcomes of token rotation.
type RotationResult =
    | { status: 'not_found' }
    | { status: 'reuse' }
    | { status: 'expired' }
    | {
        status: 'rotated';
        userId: number;
        username: string;
    };


// --------------------------------------------------
// CREATE REFRESH TOKEN
// --------------------------------------------------

export async function createRefreshTokenRecord({
    userId,
    familyId,
    tokenHash,
    expiresAt
}: CreateRefreshTokenInput): Promise<void> {

    await pool.execute(
        `INSERT INTO refresh_tokens
         (user_id, family_id, token_hash, expires_at)
         VALUES (?, ?, ?, ?)`,
        [userId, familyId, tokenHash, expiresAt]
    );
}


// --------------------------------------------------
// ROTATE REFRESH TOKEN
// --------------------------------------------------

export async function rotateRefreshTokenRecord({
    currentTokenHash,
    newTokenHash,
    newExpiresAt
}: RotateRefreshTokenInput): Promise<RotationResult> {

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [rows] = await connection.execute<RefreshTokenRow[]>(
            `SELECT
                rt.id,
                rt.user_id AS userId,
                rt.family_id AS familyId,
                rt.revoked_at AS revokedAt,
                rt.expires_at <= UTC_TIMESTAMP(3) AS isExpired,
                u.username
             FROM refresh_tokens rt
             INNER JOIN users u ON u.id = rt.user_id
             WHERE rt.token_hash = ?
             FOR UPDATE`,
            [currentTokenHash]
        );

        if (rows.length === 0) {
            await connection.commit();

            return { status: 'not_found' };
        }

        const record = rows[0];

        // Previously used refresh token detected.
        // Revoke the entire session family.
        if (record.revokedAt !== null) {

            await connection.execute(
                `UPDATE refresh_tokens
                 SET revoked_at = COALESCE(
                     revoked_at,
                     UTC_TIMESTAMP(3)
                 )
                 WHERE family_id = ?`,
                [record.familyId]
            );

            await connection.commit();

            return { status: 'reuse' };
        }

        // Check token expiry.
        if (
            record.isExpired === true ||
            record.isExpired === 1
        ) {

            await connection.execute(
                `UPDATE refresh_tokens
                 SET revoked_at = UTC_TIMESTAMP(3)
                 WHERE id = ?`,
                [record.id]
            );

            await connection.commit();

            return { status: 'expired' };
        }

        // Revoke the previous token.
        await connection.execute(
            `UPDATE refresh_tokens
             SET revoked_at = UTC_TIMESTAMP(3),
                 replaced_by_hash = ?
             WHERE id = ?
               AND revoked_at IS NULL`,
            [newTokenHash, record.id]
        );

        // Insert the replacement token.
        await connection.execute(
            `INSERT INTO refresh_tokens
             (user_id, family_id, token_hash, expires_at)
             VALUES (?, ?, ?, ?)`,
            [
                record.userId,
                record.familyId,
                newTokenHash,
                newExpiresAt
            ]
        );

        await connection.commit();

        return {
            status: 'rotated',
            userId: record.userId,
            username: record.username
        };

    } catch (error) {

        try {
            await connection.rollback();
        } catch {
            // Preserve the original database error.
        }

        throw error;

    } finally {
        connection.release();
    }
}


// --------------------------------------------------
// REVOKE REFRESH TOKEN FAMILY
// --------------------------------------------------

export async function revokeRefreshTokenFamilyByHash(
    tokenHash: string
): Promise<void> {

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [rows] = await connection.execute<RefreshFamilyRow[]>(
            `SELECT family_id
             FROM refresh_tokens
             WHERE token_hash = ?
             FOR UPDATE`,
            [tokenHash]
        );

        if (rows.length > 0) {

            await connection.execute(
                `UPDATE refresh_tokens
                 SET revoked_at = COALESCE(
                     revoked_at,
                     UTC_TIMESTAMP(3)
                 )
                 WHERE family_id = ?`,
                [rows[0].family_id]
            );
        }

        await connection.commit();

    } catch (error) {

        try {
            await connection.rollback();
        } catch {
            // Preserve the original database error.
        }

        throw error;

    } finally {
        connection.release();
    }
}

