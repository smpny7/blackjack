export interface UserStore {
    user: {
        uid: string
        emailVerified: boolean
        isAnonymous: boolean
        providerData: string[]
        stsTokenManager: {
            refreshToken: string
            accessToken: string
            expirationTime: number
        }
        createdAt: number
        lastLoginAt: number
        apiKey: string
        appName: string
    }
}
