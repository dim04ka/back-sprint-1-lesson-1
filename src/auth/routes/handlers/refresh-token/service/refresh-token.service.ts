import { RefreshTokenRepository } from '../repository/refresh-token.repository'

export class RefreshTokenService {
    constructor(
        private readonly refreshTokenRepository: RefreshTokenRepository
    ) {}
    async add(userId: string, token: string): Promise<void> {
        await this.refreshTokenRepository.add(userId, token)
    }
    async findByToken(
        token: string
    ): Promise<{ userId: string } | null> {
        return await this.refreshTokenRepository.findByToken(token)
    }
}
