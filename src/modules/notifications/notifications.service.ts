import { Notification } from './notifications.model'
import { INotification } from './notifications.interface'

const createNotification = (data: INotification) => {
    return Notification.create(data)
}

const getNotifications = (query: { [key: string]: any } = {}) => {
    return Notification.find(query)
}

const getCountNotifications = (query?: { [key: string]: any }) => {
    return Notification.countDocuments(query)
}

const notificationService = {
    createNotification,
    getNotifications,
    getCountNotifications,
}

export default notificationService
