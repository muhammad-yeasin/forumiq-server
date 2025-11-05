export const USER_ROLES = {
    user: 'user',
    admin: 'admin',
} as const

export const USER_STATUS = {
    active: 'active',
    inactive: 'inactive',
    banned: 'banned',
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]
export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS]
