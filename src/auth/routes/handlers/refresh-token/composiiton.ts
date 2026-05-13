import { RefreshTokenService } from './service/refresh-token.service'
import { RefreshTokenRepository } from './repository/refresh-token.repository'

export const refreshTokenService = new RefreshTokenService(
    new RefreshTokenRepository()
)
