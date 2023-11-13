import { UserAdapter } from 'src/app/adapters/out/adapters/user/user.adapter';
import { UserPort } from 'src/app/ports/in';

export class UserApplication implements UserPort {
  userAdapter: UserAdapter;

  constructor({ userAdapter }) {
    this.userAdapter = userAdapter;
  }
}
