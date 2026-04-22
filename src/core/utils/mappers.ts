export const mapToPaginatedOutput = <T>(
    items: T[],
    meta: {
        pageNumber: number
        pageSize: number
        totalCount: number
    }
) => {
    return {
        items,
        meta: {
            page: meta.pageNumber,
            pageSize: meta.pageSize,
            totalCount: meta.totalCount,
            pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
        },
    }
}
