// Type for Register request data
export type RegisterRequest = {
  email: string
  password: string
  first_name: string
  last_name: string
}

// Type for Register response data
export type RegisterResponse = {
  status: string
  message?: string
  error?: string
}

// Type for Login request data
export type LoginRequest = {
  email: string
  password: string
}

// Type for Login response data
export type LoginResponse = {
  status: string
  token?: string
  message?: string
  error?: string
  user?: AppUser
}

// Type for Application User
export type AppUser = {
  firstName: string
  lastName: string
  email: string
}
