import 'dotenv/config'

export const env = {
    PORT: process.env.PORT!,
    NODE_ENV: process.env.NODE_ENV as 'development' | 'production' | 'test',
    CORS_ORIGIN: process.env.CORS_ORIGIN?.split(',') || [],
}
