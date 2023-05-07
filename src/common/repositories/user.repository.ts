import { BaseRepository } from '@/common/repositories/base.repository'
import { UserModel } from '@/common/models/user.model'
import { IUser } from '@/common/interfaces/user.interface'

export class UserRepository extends BaseRepository<UserModel> implements IUser.Repository {
  constructor() {
    super(UserModel)
  }
}
