import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    ForbiddenException,
    NotFoundException,
} from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";
import { ROLE_KEY } from "src/decorators/role.decorator";
import { Model } from "mongoose";
import { User } from "../auth/schemas/user.schema";

@Injectable()
export class AuthorizationGuard implements CanActivate {
    constructor(
        @InjectModel(User.name) private UserModel: Model<User>,
        private readonly reflector: Reflector,
    ) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        console.log('Inside AUTHORIZATION');

        const requiredRoles = this.reflector.get<string[]>(
            ROLE_KEY,
            context.getHandler()
        )

        if (!requiredRoles) {
            return true; //No roles specified, access allowed
        }

        console.log(`required roles: ${requiredRoles}`);
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || !user.id) {
            throw new UnauthorizedException('Need user to continues');
        }

        console.log(`the user is ${JSON.stringify(user)}`);
        const userRole = this.getUserRoleFromDB(user.id);
        console.log(`the role from the DB is ${userRole}`);

        if (!userRole || !requiredRoles.includes(userRole.toString())) {
            throw new ForbiddenException('User does not have the required roles');
        }

        return true;
    }

    private async getUserRoleFromDB(userId: string): Promise<string> | null {
        const user = await this.UserModel.findById(userId);

        if (!user) {
            throw new NotFoundException('User not exist');
        }

        return user.role;
    }
        
}
