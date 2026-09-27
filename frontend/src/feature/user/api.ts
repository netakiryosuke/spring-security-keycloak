import apiClient from '../../api/client'
import type { User, UserSummary } from './type'

export const findMyProfile = async (): Promise<User> => {
  const res = await apiClient.get<User>('/users/me')
  return res.data
}

export const findAllUsers = async (): Promise<UserSummary[]> => {
  const res = await apiClient.get<UserSummary[]>('/users')
  return res.data
}
