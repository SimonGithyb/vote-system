import {
    CanActivate,
    ExecutionContext,
    Injectable,
    Logger,
    UnauthorizedException
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";


@Injectable()
export class AutenticationGuard implements CanActivate {

    constructor(private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization; //|| request.headers.authorization?.split(' ')[1];
        
        if (!token) {
            throw new UnauthorizedException();
        }
        const decodedToken = this.verifyToken(token);
        if (!decodedToken) {
            throw new UnauthorizedException();
        }

        try {
            const payload = this.jwtService.verify(token);
            request.user = decodedToken;
            request.userId = payload.userId;
        } catch(e) {
            Logger.error(e.message);
            throw new UnauthorizedException('Invalid token');
        }

        return true;
    }

    private verifyToken(token: string): any {
        try {
            return this.jwtService.verify(token);
        } catch (error) {
            Logger.error(error);
            return null;
        }
    }
}
