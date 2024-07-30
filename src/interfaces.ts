export interface JWTUser {
    id: number
    email : string
}

export interface GraphqlContext {
    user?: JWTUser
}