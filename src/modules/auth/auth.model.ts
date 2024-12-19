export class AuthModel {
  token: string;
  user: UserModel;

  constructor(token: string, user: UserModel) {
    this.token = token;
    this.user = user;
  }
}
