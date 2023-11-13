import { UserPort } from 'src/app/ports/out/user';

export class UserAdapter {
  private readonly userPort: UserPort;

  constructor({ userPort }) {
    this.userPort = userPort;
  }
}
