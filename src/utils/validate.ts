import {
    CreateVideoDto,
    ErrorMessages,
    Resolution,
    UpdateVideoDto,
} from '../types'

export const validateCreateVideoDto = (body: CreateVideoDto) => {
    const { title, author, availableResolutions } = body

    const errorsMessages: ErrorMessages = []

    if (!title || title.length < 1 || title.length > 40) {
        errorsMessages.push({
            message:
                'Title is required and must be between 1 and 40 characters',
            field: 'title',
        })
    }

    if (!author || author.length < 1 || author.length > 20) {
        errorsMessages.push({
            message:
                'Author is required and must be between 1 and 20 characters',
            field: 'author',
        })
    }

    if (!availableResolutions || availableResolutions.length === 0) {
        errorsMessages.push({
            message: 'Available resolutions are required',
            field: 'availableResolutions',
        })
    }
    if (
        availableResolutions.some(
            (resolution) =>
                !Object.values(Resolution).includes(resolution)
        )
    ) {
        errorsMessages.push({
            message: 'Available resolutions are incorrect',
            field: 'availableResolutions',
        })
    }

    return errorsMessages
}

export const validateUpdateVideoDto = (body: UpdateVideoDto) => {
    const {
        title,
        author,
        availableResolutions,
        canBeDownloaded,
        minAgeRestriction,
        publicationDate,
    } = body

    const errorsMessages: ErrorMessages = []

    if (!title || title.length < 1 || title.length > 40) {
        errorsMessages.push({
            message:
                'Title is required and must be between 1 and 40 characters',
            field: 'title',
        })
    }

    if (!author || author.length < 1 || author.length > 20) {
        errorsMessages.push({
            message:
                'Author is required and must be between 1 and 20 characters',
            field: 'author',
        })
    }

    if (!availableResolutions || availableResolutions.length === 0) {
        errorsMessages.push({
            message: 'Available resolutions are required',
            field: 'availableResolutions',
        })
    }

    if (
        availableResolutions.some(
            (resolution) =>
                !Object.values(Resolution).includes(resolution)
        )
    ) {
        errorsMessages.push({
            message: 'Available resolutions are incorrect',
            field: 'availableResolutions',
        })
    }

    if (
        canBeDownloaded === undefined ||
        typeof canBeDownloaded !== 'boolean'
    ) {
        errorsMessages.push({
            message: 'Can be downloaded is required',
            field: 'canBeDownloaded',
        })
    }

    if (
        minAgeRestriction === undefined ||
        minAgeRestriction === null ||
        minAgeRestriction < 0 ||
        minAgeRestriction > 18
    ) {
        errorsMessages.push({
            message:
                'Min age restriction is required and must be between 0 and 18',
            field: 'minAgeRestriction',
        })
    }

    if (
        publicationDate === undefined ||
        typeof publicationDate !== 'string'
    ) {
        errorsMessages.push({
            message:
                'Publication date is required and must be in the future',
            field: 'publicationDate',
        })
    }

    return errorsMessages
}
