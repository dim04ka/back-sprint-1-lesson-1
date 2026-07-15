// import { Container } from 'inversify'
// export const container = new Container()
// container.bind(UsersRepository).toSelf()
// container.bind(UsersQueryService).toSelf()

import { UsersRepository } from './users/repository/users.repository'
import { UsersQueryRepository } from './users/repository/user.query.repository'
import { UsersQueryService } from './users/service/users.query.repository'
import { UsersService } from './users/service/users.service'
import { bcryptService } from './auth/adapters/bcrypt.service'
import { CommentsService } from './comments/service/comment.service'
import { CommentsRepository } from './comments/repository/comment.repository'
import { BlogsRepository } from './blogs/repository/blogs.repository'
import { BlogsService } from './blogs/application/blogs.service'
import { AuthService } from './auth/service/auth.service'
import { PostsRepository } from './posts/repository'
import { PostsService } from './posts/application/post.service'
import { SecurityDevicesRepository } from './securityDevices/repository/securityDevices.repository'
import { SecurityDevicesService } from './securityDevices/services/securityDevices.service'
import { LikeRepository } from './comments/repository/like.repository'

// -------------- Users --------------

export const usersRepository = new UsersRepository()
export const usersQueryRepository = new UsersQueryRepository()

export const usersQueryService = new UsersQueryService(
    usersQueryRepository
)

export const usersService = new UsersService(
    usersRepository,
    bcryptService
)

// -------------- Comments --------------
export const commentsRepository = new CommentsRepository()
export const likeRepository = new LikeRepository()
export const commentsService = new CommentsService(
    commentsRepository,
    likeRepository
)

// -------------- Blogs --------------
export const blogsRepository = new BlogsRepository()
export const blogsService = new BlogsService(blogsRepository)

// -------------- Auth --------------
export const authService = new AuthService()

// -------------- Posts --------------
export const postsRepository = new PostsRepository()
export const postsService = new PostsService(postsRepository)

// -------------- Security Devices --------------
export const securityDevicesRepository =
    new SecurityDevicesRepository()
export const securityDevicesService = new SecurityDevicesService(
    securityDevicesRepository
)
