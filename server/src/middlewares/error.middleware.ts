import type {
  Request,
  Response,
  NextFunction,
} from 'express';

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }

  console.error(err);

  return res.status(500).json({
    statusCode: 500,
    success: false,
    message: err.message || 'Internal Server Error',
    data: null
  });
};



// import type {
//   Request,
//   Response,
//   NextFunction,
// } from 'express';

// export function errorMiddleware(
//   err: Error,
//   _req: Request,
//   res: Response,
//   _next: NextFunction
// ) {
//   console.error(err);

//   res.status(500).json({
//     statusCode: 500,
//     success: false,
//     message: 'Internal server error',
//     data: null,
//   });
// }
