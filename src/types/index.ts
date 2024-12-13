export type Organization = {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export type Project = {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export type RegisterUserRequest = {
  firstName: string
  lastName: string
  email: string
  password: string
  hasAcceptedTerms: boolean
}

export type LoginUserRequest = {
  email: string
  password: string
  shouldRememberCredentials: boolean
}
