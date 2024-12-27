import type { HttpClient } from '@/types'
import type { LoginUserRequest, LoginUserResponse, RegisterUserRequest, User } from '@/types/user'

export default interface UserGateway {
  registerUser(request: RegisterUserRequest): Promise<string>
  loginUser(request: LoginUserRequest): Promise<LoginUserResponse>
  getCurrentUser(): Promise<User>
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
}
