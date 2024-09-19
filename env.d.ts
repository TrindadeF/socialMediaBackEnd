declare namespace NodeJS {
    interface ProcessEnv {
        PORT: number
        URL: string
        SALT: number
        SECURITY_KEY: string
    }
}
