import { errorsHandler } from '../../../core/errors/errors.handler'
import { Request, Response } from 'express'
// import { usersRepository } from '../../../users/repository/users.repository'
import { HttpStatus } from '../../../core/types/http-statuses'
import { authService } from '../../../composition-root'
import { ResultStatus } from '../../../common/result/resultCode'

export const registrationConfirmationHandler = async (
    req: Request,
    res: Response
) => {
    try {
        const { code } = req.body

        const result = await authService.confirmEmail(code)

        if (result?.status === ResultStatus.Success)    
            return res.status(HttpStatus.NoContent)
        return res.status(HttpStatus.BadRequest).send(result.errorMessage)

    } catch (e: unknown) {
        errorsHandler(e, res)
    }
}
