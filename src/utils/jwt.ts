import jwt from 'jsonwebtoken'

// jwt generator
export const generateJwt = (
    payload: any,
    secret: string,
    expiresIn: jwt.SignOptions['expiresIn']
): string => {
    return jwt.sign(payload, secret, { expiresIn })
}

// jwt verifier
export const verifyJwt = async (
    token: string,
    secret: string
): Promise<any> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                return reject(err)
            }
            resolve(decoded)
        })
    })
}

// jwt decoder
export const decodeJwt = (token: string): any => {
    return jwt.decode(token)
}
