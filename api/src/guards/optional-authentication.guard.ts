import {
    CanActivate,
    ExecutionContext,
    Injectable
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class OptionalAuthenticationGuard implements CanActivate {

    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        
        if (token) {
            try {
                const payload = await this.jwtService.verifyAsync(token);
                request.user = payload;
                request.userId = payload.userId;
            } catch (error) {
                // Ignore error for optional authentication
            }
        }

        return true;
    }

    private extractTokenFromHeader(request: any): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
