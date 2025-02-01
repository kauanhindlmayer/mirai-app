import http from '@/gateways/HttpClient'
import type {
  LoginUserRequest,
  LoginUserResponse,
  RegisterUserRequest,
  UpdateUserProfileRequest,
  User,
} from '@/types/user'

export function registerUser(request: RegisterUserRequest): Promise<string> {
  return http.post<string>('/users/register', request)
}

export async function loginUser(request: LoginUserRequest): Promise<LoginUserResponse> {
  return http.post<LoginUserResponse>('/users/login', request)
}

export function getCurrentUser(): Promise<User> {
  return http.get<User>('/users/me')
}

export function updateUserProfile(request: UpdateUserProfileRequest): Promise<void> {
  return http.put('/users/profile', request)
}

export function updateProfilePicture(file: File): Promise<void> {
  const formData = new FormData()
  formData.append('file', file)
  return http.post('/users/profile/picture', formData)
}
