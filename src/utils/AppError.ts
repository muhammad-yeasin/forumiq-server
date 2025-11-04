class AppError extends Error {
    statusCode: number
    status: 'fail' | 'error'
    isOperational: boolean
    data?: { field: string; message: string }[] | undefined

    constructor(
        message: string,
        statusCode: number,
        data?: { field: string; message: string }[]
    ) {
        super(message)
        this.name = 'AppError'
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
        this.statusCode = statusCode
        this.data = data
        this.isOperational = true
        Object.setPrototypeOf(this, AppError.prototype)

        if (typeof (Error as any).captureStackTrace === 'function') {
            ;(Error as any).captureStackTrace(this, this.constructor)
        }
    }
}

export default AppError
