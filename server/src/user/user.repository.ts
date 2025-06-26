import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { UserEntity } from './entities/user.entity';

interface UserWithRole extends UserEntity {
  roleName: string;
}

@Injectable()
export class UserRepository {
  constructor(@Inject('KnexConnection') private readonly knex: Knex) {}

  async create(user: Partial<UserEntity>): Promise<UserEntity> {
    const [created] = await this.knex<UserEntity>('users')
      .insert(user)
      .returning('*');
    return created;
  }

  async findByIdWithRole(id: string): Promise<UserWithRole | null> {
    const user = (await this.knex<UserEntity>('users')
      .select('users.*', 'roles.name as roleName')
      .leftJoin('roles', 'users.role_id', 'roles.id')
      .where('users.id', id)
      .first()) as UserWithRole | undefined;

    return user ?? null;
  }

  async findAllWithRole(): Promise<UserWithRole[]> {
    return this.knex<UserEntity>('users')
      .select('users.*', 'roles.name as roleName')
      .leftJoin('roles', 'users.role_id', 'roles.id');
  }
}
