export class ServiceAccount {
  id: string;
  password: string;
  scope: string;

  static create(id: string, password: string, scope: string) {
    const result = new ServiceAccount();

    result.id = id;
    result.password = password;
    result.scope = scope;

    return result;
  }
}
