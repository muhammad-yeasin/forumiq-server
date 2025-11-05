import { refineQuery } from './query'

class ApiFeatures {
    query: any
    queryString: any
    constructor(query: any, queryString: any) {
        this.query = query
        this.queryString = queryString
    }

    filter(extraQuery?: { [key: string]: any }) {
        let queryObj = refineQuery(this.queryString)

        if (extraQuery) {
            queryObj = { ...queryObj, ...extraQuery }
        }

        this.query = this.query.find(queryObj)
        return this
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createdAt')
        }
        return this
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ')
            this.query = this.query.select(fields)
        } else {
            this.query = this.query.select('-__v')
        }
        return this
    }

    paginate() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 10
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this
    }

    populate(
        field:
            | string
            | Array<{
                  path: string
                  select?: string
                  match?: { [key: string]: any }
              }>,
        selectFields?: string,
        match?: { [key: string]: any }
    ) {
        if (typeof field === 'string') {
            this.query = this.query.populate({
                path: field,
                select: selectFields,
                match: match || {},
            })
        } else if (Array.isArray(field)) {
            field.forEach(fld => {
                this.query = this.query.populate({
                    path: fld.path,
                    select: fld.select || '',
                    match: fld.match || {},
                })
            })
        }
        return this
    }
}

export default ApiFeatures
