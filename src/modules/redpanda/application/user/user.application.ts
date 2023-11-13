import { UserAdapter } from '../../adapters/out/adapters/user/user.adapter';
import { UserPort } from '../../ports/in';

export class UserApplication implements UserPort {
  userAdapter: UserAdapter;

  constructor({ userAdapter }) {
    this.userAdapter = userAdapter;
  }
}
