declare namespace NodeJS{
    export interface ProcessEnv{
        DATABASE_URL:string
        jwtSecretKey:string
        jwtRefreshTokenKey:string
    }
}

declare module 'midtrans-client' {
    export default Midtrans;
}