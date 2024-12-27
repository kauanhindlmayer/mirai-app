export type User = {
  id: string
  email: string
  firstName: string
  lastName: string
}

export type RegisterUserRequest = {
  firstName: string
  lastName: string
  email: string
  password: string
}

export type LoginUserRequest = {
  email: string
  password: string
}

export type LoginUserResponse = {
  accessToken: string
}
