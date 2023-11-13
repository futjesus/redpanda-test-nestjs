import { UserPort } from 'src/modules/redpanda/ports/in';

export class UserAdapter {
  private readonly userPort: UserPort;

  constructor({ userPort }) {
    this.userPort = userPort;
  }
}
