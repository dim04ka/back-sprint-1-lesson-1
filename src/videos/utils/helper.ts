export const getCreatedAndPublicationDates = (): {
    createdAt: string
    publicationDate: string
} => {
    const now = new Date()

    const createdAt = now.toISOString()
    const publicationDate = new Date(
        now.setDate(now.getDate() + 1)
    ).toISOString()

    return { createdAt, publicationDate }
}
