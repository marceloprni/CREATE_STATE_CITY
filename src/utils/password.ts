import bcryptjs from 'bcryptjs';

export const createPaswwordHashed = async (password: string): Promise<string> => {
  const hashedPassword = bcryptjs.hash(password, 10);
  return hashedPassword;
};

export const comparePasswords = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  const isMatch = await bcryptjs.compare(plainPassword, hashedPassword);
  return isMatch;
};
