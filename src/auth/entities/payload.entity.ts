//this interfaces follows the prisma user model
export interface jwtPayload {
    email: string,
    role: string|null,
    id: number,
    sub: {
      name: string|null,
    }
}