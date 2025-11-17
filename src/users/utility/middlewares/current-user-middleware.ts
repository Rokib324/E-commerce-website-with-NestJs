
import { Injectable, NestMiddleware } from '@nestjs/common';
import { isArray } from 'class-validator';
import { verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/users/entities/user.entity';


declare global {
    namespace Express {
        interface Request {
            currentUser?: UserEntity | null;
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(private readonly usersService: UsersService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || isArray(authHeader) || !authHeader.startsWith('Bearer ')) {
        req.currentUser = null;
        next();
    } else {
        try {
            const token = authHeader.split(' ')[1];
            if (!token) {
                req.currentUser = null;
                next();
                return;
            }
            const secret = process.env.ACCESS_TOKEN_SECRET_KEY;
            if (!secret) {
                req.currentUser = null;
                next();
                return;
            }
            const {id} = <JwtPayload>verify(token, secret);
            const currentUser = await this.usersService.findOne(+id);
            console.log("currentUser", currentUser);
            req.currentUser = currentUser;
            next();
        } catch (error) {
            // Invalid or malformed token - continue without user
            req.currentUser = null;
            next();
        }
    }
  }
}

interface JwtPayload {
    id: string;
}
