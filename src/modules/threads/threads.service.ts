import { IThread } from './threads.interface'
import { Thread } from './threads.model'

const createThread = (data: IThread) => {
    return Thread.create(data)
}

const getThreadById = (id: string) => {
    return Thread.findById(id).populate('user', 'username avatar')
}

const getThreads = (query: { [key: string]: any } = {}) => {
    return Thread.find(query)
}

const getCountThreads = (query?: { [key: string]: any }) => {
    return Thread.countDocuments(query)
}

const threadService = {
    createThread,
    getThreadById,
    getThreads,
    getCountThreads,
}

export default threadService
