

import { UsersRepository } from "./users/repository/users.repository"
import { UsersService } from "./users/service/users.service"
import { AuthService } from "./auth/business-logic/auth-service"
import { NodemailerService } from "./auth/adapters/nodemailer.service"
import { JwtService } from "./auth/adapters/jwt.service"

const nodemailerService = new NodemailerService()

export const usersRepository = new UsersRepository()
export const jwtService = new JwtService()

export const usersService = new UsersService(usersRepository)

export const authService = new AuthService(usersRepository, nodemailerService, jwtService)