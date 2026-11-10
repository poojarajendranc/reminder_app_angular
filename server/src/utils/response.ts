import type {Response} from 'express';

export function successResponse(
    res:Response,
    message:string,
    data:unknown = null,
    statusCode = 200
) {
    return res.status(statusCode).json({
        statusCode ,
        success:true,
        message,
        data,
    })
}

export function errorResponse(
    res: Response,
    message:string,
    statusCode= 400,
    data:unknown = null
){
    return res.status(statusCode).json({
        statusCode,
        success:false,
        message,
        data,
    })

}