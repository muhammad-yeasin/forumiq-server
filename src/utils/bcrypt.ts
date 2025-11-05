import bcrypt from 'bcryptjs'

async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    return hashedPassword
}

async function comparePasswords(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, hashedPassword)
    return isMatch
}

export { hashPassword, comparePasswords }
