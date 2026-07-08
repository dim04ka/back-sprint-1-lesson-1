// import { refreshTokensCollection } from '../../../../../db/mongo.db'

// export class RefreshTokenRepository {
//     async add(userId: string, token: string): Promise<void> {
//         await refreshTokensCollection.insertOne({
//             userId,
//             token,
//         })
//     }
//     async findByToken(
//         token: string
//     ): Promise<{ userId: string } | null> {
//         const refreshToken = await refreshTokensCollection.findOne({
//             token,
//         })
//         return refreshToken
//     }
// }
