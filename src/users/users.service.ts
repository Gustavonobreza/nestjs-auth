import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [
    { id: 1, email: 'miguelzin@ff.com', name: 'Miguelito', senha: '12345678' },
    { id: 2, email: 'augustin@ff.com', name: 'Augustito', senha: 'abcdefgh' },
    { id: 3, email: 'carlin@ff.com', name: 'Carlito', senha: '98765432' },
    { id: 4, email: 'guzin@ff.com', name: 'Gustavito', senha: 'zywvutsr' },
  ];

  find(id: typeof User.prototype.id): User {
    return this.users.find(({ id: _id }) => id === _id);
  }

  findAll(): User[] {
    return this.users;
  }

  create(data: Omit<User, 'id'>): User {
    const id = this.getLastId() + 1;
    this.users.push({ ...data, id });
    this.sortUsers();
    return this.users.find(({ id: _id }) => _id === id);
  }

  destroy(user?: Partial<User>): void {
    const key = Object.keys(user);

    if (key.length > 1)
      throw new Error(
        'Invalid Parameters. Search 1 property of user is alowed to destotroy him',
      );

    const index = this.users.findIndex(
      (internalUser) => internalUser[key[0]] === user[key[0]],
    );

    if (index && index !== -1) {
      this.users.splice(index, 1);
      this.sortUsers();

      return;
    }

    throw new Error('User not found');
  }

  update(id: typeof User.prototype.id, user: Partial<User>) /*: User*/ {
    const internalUser = this.find(id);
    if (!internalUser) throw new Error('User not exists');

    const combined = { ...internalUser, ...user };

    const index = this.users.findIndex(({ id: _id }) => _id === id);

    this.users.splice(index, 1, combined);
    this.sortUsers();

    return combined;
  }

  private getLastId(): number {
    this.sortUsers();
    return this.users[this.users.length - 1].id;
  }

  private sortUsers(): void {
    this.users.sort(sortById);
  }
}

function sortById({ id }, { id: _id }) {
  return id - _id;
}

// export class UsersService {
//   create(createUserDto: CreateUserDto) {
//     return 'This action adds a new user';
//   }

//   findAll() {
//     return `This action returns all users`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} user`;
//   }

//   update(id: number, updateUserDto: UpdateUserDto) {
//     return `This action updates a #${id} user`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} user`;
//   }
// }
