export type User = {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  imageUrl: string
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

export type UpdateUserProfileRequest = {
  firstName: string
  lastName: string
}
