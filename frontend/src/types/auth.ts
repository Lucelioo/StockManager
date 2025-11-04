export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  userInfo: UserInfoResponse;
}

export interface UserInfoResponse {
  id: number;
  username: string;
  email: string;
  nomeCompleto?: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}