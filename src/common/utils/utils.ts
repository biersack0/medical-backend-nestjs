import * as bcrypt from 'bcrypt';

export class Utils {
  encryptPassword(password: string) {
    const saltOrRounds = bcrypt.genSaltSync();
    const encryptedPassword = bcrypt.hashSync(password, saltOrRounds);
    return encryptedPassword;
  }

  async isSamePassword(password: string, passwordInDatabase: string) {
    const isMatch = await bcrypt.compare(password, passwordInDatabase);
    return isMatch;
  }

  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
