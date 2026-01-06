export enum Resolution {
    P144 = 'P144',
    P240 = 'P240',
    P360 = 'P360',
    P480 = 'P480',
    P720 = 'P720',
    P1080 = 'P1080',
    P1440 = 'P1440',
    P2160 = 'P2160',
}

export type Video = {
    id: number
    title: string
    author: string
    canBeDownloaded: boolean
    minAgeRestriction: number | null
    createdAt: string
    publicationDate: string
    availableResolutions: Resolution[]
}

export type CreateVideoDto = {
    title: string
    author: string
    availableResolutions: Resolution[]
}

export type ErrorMessages = {
    message: string
    field: string
}[]

export type UpdateVideoDto = {
    title: string
    author: string
    availableResolutions: Resolution[]
    canBeDownloaded: boolean
    minAgeRestriction: number | null
    publicationDate: string
}
