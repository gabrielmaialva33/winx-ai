import { BaseRepository } from '@/common/repositories/base.repository'
import { UserModel } from '@/common/models/user.model'

export namespace IUser {
  export interface Repository extends BaseRepository<UserModel> {}
}
