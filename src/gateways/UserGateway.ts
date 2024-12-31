import type { HttpClient } from '@/types'
import type {
  LoginUserRequest,
  LoginUserResponse,
  RegisterUserRequest,
  UpdateUserProfileRequest,
  User,
} from '@/types/user'

export default interface UserGateway {
  registerUser(request: RegisterUserRequest): Promise<string>
  loginUser(request: LoginUserRequest): Promise<LoginUserResponse>
  getCurrentUser(): Promise<User>
  updateProfilePicture(file: File): Promise<void>
  updateUserProfile(request: UpdateUserProfileRequest): Promise<void>
}

export class UserGatewayHttp implements UserGateway {
  constructor(readonly httpClient: HttpClient) {}

  registerUser(request: RegisterUserRequest): Promise<string> {
    return this.httpClient.post('/users/register', request)
  }

  loginUser(request: LoginUserRequest): Promise<LoginUserResponse> {
    return this.httpClient.post('/users/login', request)
  }

  getCurrentUser(): Promise<User> {
    return this.httpClient.get('/users/me')
  }

  updateUserProfile(request: UpdateUserProfileRequest): Promise<void> {
    return this.httpClient.put('/users/profile', request)
  }

  updateProfilePicture(file: File): Promise<void> {
    const formData = new FormData()
    formData.append('file', file)
    return this.httpClient.post('/users/profile/picture', formData)
  }
}
