import { Role } from '@/constant'

export interface MessageModel {
  role: Role
  content: string
  error?: boolean
}
