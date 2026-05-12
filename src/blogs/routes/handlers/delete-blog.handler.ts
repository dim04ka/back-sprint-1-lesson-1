import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses'
import { errorsHandler } from '../../../core/errors/errors.handler'
import { blogsService } from '../../application/blogs.service'

export const deleteBlogHandler = async (
    req: Request,
    res: Response
) => {
    try{
        const id: string = req.params.id as string
        await blogsService.delete(id)
        res.sendStatus(HttpStatus.NoContent)
    } catch (e: unknown) {
        errorsHandler(e, res)
    }
    
    

  
}
