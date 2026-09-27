export interface UserSummary {
  id: string
  username: string
  email: string
  birthDate: string
}

export interface User extends UserSummary {
  residence: string
  occupation: string
  introduction: string
  secretMessage: string
}
