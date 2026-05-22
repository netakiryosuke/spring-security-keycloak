import apiClient from '../../api/client'
import type { User } from './type'

export const findMyProfile = async (): Promise<User> => {
  const res = await apiClient.get<User>('/users/me')
  return res.data
}

export const findAllUsers = async (): Promise<User[]> => {
  const res = await apiClient.get<User[]>('/users')
  return res.data
}
