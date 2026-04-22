import { config } from 'dotenv'

config()

const getRequiredEnv = (name: string): string => {
    const value = process.env[name]

    if (!value) {
        throw new Error(`[config] Missing required env: ${name}`)
    }

    return value
}

export const appConfig = {
    PORT: process.env.PORT ?? '5001',
    MONGO_CONNECT_URL: getRequiredEnv('MONGO_CONNECT_URL'),
    MONGO_DB_NAME: getRequiredEnv('MONGO_DB_NAME'),
    AC_SECRET: getRequiredEnv('AC_SECRET'),
    AC_TIME: getRequiredEnv('AC_TIME'),
    RT_SECRET: process.env.RT_SECRET ?? '',
    DB_TYPE: process.env.DB_TYPE ?? 'mongodb',
    EMAIL: process.env.EMAIL ?? '',
    EMAIL_PASS: process.env.EMAIL_PASS ?? '',
} as const
