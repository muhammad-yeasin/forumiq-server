import 'dotenv/config'
import jwt from 'jsonwebtoken'

export const env = {
    PORT: process.env.PORT!,
    NODE_ENV: process.env.NODE_ENV as 'development' | 'production' | 'test',
    CORS_ORIGIN: process.env.CORS_ORIGIN?.split(',') || [],
    DATABASE_URL: process.env.DATABASE_URL!,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
    ACCESS_TOKEN_EXPIRES_IN: process.env
        .ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    GENAI_API_KEY: process.env.GENAI_API_KEY!,
    GENAI_MODEL: process.env.GENAI_MODEL!,
}
