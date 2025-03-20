import { Request } from 'express';

declare module 'express' {
  interface Request {
    user?: any; // Or replace `any` with your `User` type if available
  }
}
