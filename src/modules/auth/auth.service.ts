import { NotFoundException } from '@exceptions/not-found-exception';
import { UserModel } from '@modules/User/User.model';
import { getUserByEmail } from '@modules/User/user.service';
import { comparePasswords } from '@utils/password';
import { AuthModel } from './auth.model';
import { generateToken } from '@utils/auth';

export const validateAuth = async (authDto: AuthDTO): Promise<AuthModel> => {
  const user = await getUserByEmail(authDto.email);

  const isValidPassword = await comparePasswords(authDto.password, user.password);

  if (!isValidPassword) {
    throw new NotFoundException('Invalid password or email');
  }
  return new AuthModel(generateToken(user), user);
};
