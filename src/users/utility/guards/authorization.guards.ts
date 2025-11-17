import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { UserRoles } from "../common/user-roles.enum";

@Injectable()
export class AuthorizeGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const AllowedRoles = this.reflector.get<string[]>('allowedroles', context.getHandler());
        if (!AllowedRoles || AllowedRoles.length === 0) {
            return true; // No roles specified, allow access
        }
        const request = context.switchToHttp().getRequest();
        if (!request?.currentUser) {
            throw new UnauthorizedException('You are not authorized to access this resource');
        }
        const userRoles = request.currentUser.roles || [];
        const hasRequiredRole = userRoles.some((role: UserRoles) => AllowedRoles.includes(role));
        if (hasRequiredRole) {
            return true;
        } else {
            throw new UnauthorizedException('You are not authorized to access this resource');
        }
    }
   
}