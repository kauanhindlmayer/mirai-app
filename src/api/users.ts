import http from '~/api/http'
import type {
  LoginUserRequest,
  LoginUserResponse,
  RegisterUserRequest,
  UpdateUserProfileRequest,
  User,
} from '~/types/user'

export function registerUser(request: RegisterUserRequest): Promise<string> {
  return http.post('/users/register', request)
}

export async function loginUser(request: LoginUserRequest): Promise<LoginUserResponse> {
  return http.post('/users/login', request)
}

export function getCurrentUser(): Promise<User> {
  return http.get('/users/me')
}

export function updateUserProfile(request: UpdateUserProfileRequest): Promise<void> {
  return http.put('/users/profile', request)
}

export function updateAvatar(file: File): Promise<void> {
  const formData = new FormData()
  formData.append('file', file)
  return http.patch('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
