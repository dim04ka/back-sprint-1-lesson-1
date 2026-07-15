import { Request, Response } from 'express'
import { sortQueryFieldsUtil } from '../../../core/utils/sortQueryFields.util'
import { usersQueryRepository } from '../../../composition-root'
import { errorsHandler } from '../../../core/errors/errors.handler'

export const usersHandler = async (req: Request, res: Response) => {
    const { pageNumber, pageSize, sortBy, sortDirection } =
        sortQueryFieldsUtil(req.query)
    const { searchLoginTerm, searchEmailTerm } = req.query

    try {
        const allUsers = await usersQueryRepository.findAllUsers({
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchLoginTerm: searchLoginTerm as string,
            searchEmailTerm: searchEmailTerm as string,
        })

        return res.status(200).send(allUsers)
    } catch (error) {
        errorsHandler(error, res)
    }
}
