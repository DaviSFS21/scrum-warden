import { Role } from '../../common/enums/role.enum';
export declare class CreateUserDto {
    email: string;
    name: string;
    password: string;
    role: Role;
}
