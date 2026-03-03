import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
        };
    }>;
    me(req: any): Promise<{
        email: string;
        id: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        active: boolean;
    } | null>;
}
