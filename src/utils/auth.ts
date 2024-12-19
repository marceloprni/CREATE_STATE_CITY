import { UnauthorizedException } from '@exceptions/unauthorized-exception';
import { UserAuth } from '@modules/auth/dtos/user-auth.dto';
import { UserModel } from '@modules/User/User.model';
import { sign, verify } from 'jsonwebtoken';

const secretKey = 'aasdasdiw2193193saasd';

export const generateToken = (user: UserModel): string => {
  const token = sign(
    {
      userId: user.id,
      email: user.email,
      typeUser: user.typeUser,
    } as UserAuth,
    secretKey,
    {
      subject: String(user.id),
      expiresIn: '1d',
    },
  );

  return token;
};

export const verifyToken = async (authorization?: string): Promise<UserAuth> => {
  if (!authorization) {
    throw new UnauthorizedException();
  }

  const [, token] = authorization.split(' ');

  try {
    const decodedToken = verify(token, secretKey) as UserAuth;

    return decodedToken;
  } catch (error) {
    throw new UnauthorizedException();
  }
};

export const getUserByToken = async (req: Request): Promise<UserAuth> => {
  const authorization = req.headers.authorization;

  return verifyToken(authorization);
};
