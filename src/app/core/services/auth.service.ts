import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../..///../environments/environments';
import {
    RegisterRequest,
    LoginRequest,
    AuthResponse,
    ApiResponse,
    AuthUser,
} from '../models/auth.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private http = inject(HttpClient);

    private readonly apiUrl = `${environment.apiUrl}/auth`;

    register(
        request: RegisterRequest
    ): Observable<ApiResponse<null>> {
        return this.http.post<ApiResponse<null>>(
            `${this.apiUrl}/register`,
            request
        );
    }

    login(
        request: LoginRequest
    ): Observable<ApiResponse<AuthResponse>> {
        return this.http.post<ApiResponse<AuthResponse>>(
            `${this.apiUrl}/login`,
            request
        );
    }

    private platformId = inject(PLATFORM_ID);

    private get isBrowser(): boolean {
        return isPlatformBrowser(this.platformId);
    }

    isLoggedIn(): boolean {
        return this.isBrowser && !!localStorage.getItem('token');
    }

    getToken(): string | null {
        return this.isBrowser ? localStorage.getItem('token') : null;
    }

    getCurrentUser() {
        if (!this.isBrowser) {
            return null;
        }
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    logout(): void {
        if (!this.isBrowser) {
            return;
        }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    getCurrentUserFromApi() {
        return this.http.get<ApiResponse<AuthUser>>(
            `${this.apiUrl}/me`
        );
    }

}
