export enum Resolution {
    x144 = '144p',
    x240 = '240p',
    x360 = '360p',
    x480 = '480p',
    x720 = '720p',
    x1080 = '1080p',
    x1440 = '1440p',
    x2160 = '2160p',
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
