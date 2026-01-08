import {
    CreateVideoDto,
    ErrorMessages,
    Resolution,
    UpdateVideoDto,
} from '../dto'

type ValidationError = {
    message: string
    field: string
}

const validateTitle = (
    title: string | undefined
): ValidationError | null => {
    if (!title || title.length < 1 || title.length > 40) {
        return {
            message:
                'Title is required and must be between 1 and 40 characters',
            field: 'title',
        }
    }
    return null
}

const validateAuthor = (
    author: string | undefined
): ValidationError | null => {
    if (!author || author.length < 1 || author.length > 20) {
        return {
            message:
                'Author is required and must be between 1 and 20 characters',
            field: 'author',
        }
    }
    return null
}

const validateAvailableResolutions = (
    availableResolutions: Resolution[] | undefined
): ValidationError[] => {
    const errors: ValidationError[] = []

    if (!availableResolutions || availableResolutions.length === 0) {
        errors.push({
            message: 'Available resolutions are required',
            field: 'availableResolutions',
        })
        return errors
    }

    if (
        availableResolutions.some(
            (resolution) =>
                !Object.values(Resolution).includes(resolution)
        )
    ) {
        errors.push({
            message: 'Available resolutions are incorrect',
            field: 'availableResolutions',
        })
    }

    return errors
}

const validateCanBeDownloaded = (
    canBeDownloaded: boolean | undefined
): ValidationError | null => {
    if (
        canBeDownloaded === undefined ||
        typeof canBeDownloaded !== 'boolean'
    ) {
        return {
            message: 'Can be downloaded is required',
            field: 'canBeDownloaded',
        }
    }
    return null
}

const validateMinAgeRestriction = (
    minAgeRestriction: number | null | undefined
): ValidationError | null => {
    if (
        minAgeRestriction === undefined ||
        minAgeRestriction === null ||
        minAgeRestriction < 0 ||
        minAgeRestriction > 18
    ) {
        return {
            message:
                'Min age restriction is required and must be between 0 and 18',
            field: 'minAgeRestriction',
        }
    }
    return null
}

const validatePublicationDate = (
    publicationDate: string | undefined
): ValidationError | null => {
    if (
        publicationDate === undefined ||
        typeof publicationDate !== 'string'
    ) {
        return {
            message:
                'Publication date is required and must be in the future',
            field: 'publicationDate',
        }
    }
    return null
}

export const validateCreateVideoDto = (
    body: CreateVideoDto
): ErrorMessages => {
    const { title, author, availableResolutions } = body

    const errorsMessages: ErrorMessages = []

    const titleError = validateTitle(title)
    if (titleError) errorsMessages.push(titleError)

    const authorError = validateAuthor(author)
    if (authorError) errorsMessages.push(authorError)

    const resolutionErrors = validateAvailableResolutions(
        availableResolutions
    )
    errorsMessages.push(...resolutionErrors)

    return errorsMessages
}

export const validateUpdateVideoDto = (
    body: UpdateVideoDto
): ErrorMessages => {
    const {
        title,
        author,
        availableResolutions,
        canBeDownloaded,
        minAgeRestriction,
        publicationDate,
    } = body

    const errorsMessages: ErrorMessages = []

    const titleError = validateTitle(title)
    if (titleError) errorsMessages.push(titleError)

    const authorError = validateAuthor(author)
    if (authorError) errorsMessages.push(authorError)

    const resolutionErrors = validateAvailableResolutions(
        availableResolutions
    )
    errorsMessages.push(...resolutionErrors)

    const canBeDownloadedError =
        validateCanBeDownloaded(canBeDownloaded)
    if (canBeDownloadedError)
        errorsMessages.push(canBeDownloadedError)

    const minAgeRestrictionError =
        validateMinAgeRestriction(minAgeRestriction)
    if (minAgeRestrictionError)
        errorsMessages.push(minAgeRestrictionError)

    const publicationDateError =
        validatePublicationDate(publicationDate)
    if (publicationDateError)
        errorsMessages.push(publicationDateError)

    return errorsMessages
}
