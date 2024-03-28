// Type for Register request data
export type RegisterRequest = {
  email: string
  password: string
  first_name: string
  last_name: string
  register_to_mail_list: boolean
}

// Type for Register response data
export type RegisterResponse = {
  status: string
  message?: string
  error?: string
  detail?: string
}

// Type for Login request data
export type LoginRequest = {
  email: string
  password: string
  guest?: boolean
}

// Type for Login response data
export type LoginResponse = {
  status: string
  token?: string
  message?: string
  error?: string
  first_name?: string
  last_name?: string
}

// Type for Application User
export type User = {
  firstName: string
  lastName: string
  email: string
}

// Type for Application User
export type Error = {
  message: string
}

export type ResetPasswordResponse = { status: string }
