import type { IdType } from './src/common/types/id'

declare global {
    namespace Express {
        interface Request {
            user?: IdType
        }
    }
}

export {}
