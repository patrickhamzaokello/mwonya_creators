import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
    interface User {
        id: string;
        email: string;
        password: string;
        role: string;
    }

    interface Session {
        user: User;
    }
}