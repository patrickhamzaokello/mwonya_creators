import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
    interface User {
        id: string;
        name: string;
        email: string;
        role: string;
    }

    interface Session {
        user: User;
    }
}