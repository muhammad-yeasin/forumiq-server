export const refineQuery = (query: { [key: string]: any }) => {
    const queryObj = { ...query }
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search']
    excludedFields.forEach((el: string) => delete queryObj[el])
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
    return JSON.parse(queryStr)
}
