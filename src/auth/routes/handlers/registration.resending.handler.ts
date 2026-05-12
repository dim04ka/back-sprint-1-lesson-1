import { errorsHandler } from '../../../core/errors/errors.handler'
import { Request, Response } from 'express'

import { HttpStatus } from '../../../core/types/http-statuses'


import { authService } from '../../../composition-root'
import { ResultStatus } from '../../../common/result/resultCode'

export const registrationEmailResendingHandler = async (
    req: Request<{}, {}, { email: string }>,
    res: Response
) => {
    try {
        const { email } = req.body

        const result = await authService.resendEmail(email)

        if (result?.status === ResultStatus.Success)
            return res.status(HttpStatus.NoContent)
        return res.status(HttpStatus.BadRequest).send(result.extensions)

   
    } catch (e: unknown) {
        errorsHandler(e, res)
    }
}
