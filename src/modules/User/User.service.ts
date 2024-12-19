import { PrismaClient } from '@prisma/client';
import { UserModel } from './User.model';
import { UserInsertDTO } from './dtos/user-insert.dto';
import { ReturnError } from '@exceptions/dtos/return-error.dto';
import { NotFoundException } from '@exceptions/not-found-exception';
import { BadRequestException } from '@exceptions/bad-request-exception';
import { createPaswwordHashed } from '@utils/password';
import { UserEditPasswordDTO } from '@modules/auth/dtos/user-edit-password.dto';

const prisma = new PrismaClient();

const getUsers = async (): Promise<UserModel[]> => {
  const users = await prisma.user.findMany();

  if (users?.length === 0) {
    throw new ReturnError('User');
  }
  return users;
};

const createUser = async (body: UserInsertDTO): Promise<UserModel> => {
  const byEmail = await getUserByEmail(body.email).catch(() => undefined);

  const byCpf = await getUserByCpf(body.cpf).catch(() => undefined);

  if (byEmail || byCpf) {
    throw new BadRequestException('Email or Cpf already in use.');
  }

  const userBody: UserInsertDTO = {
    ...body,
    password: await createPaswwordHashed(body.password),
  };
  const user = await prisma.user.create({
    data: userBody,
  });

  return user;
};

const getUserByEmail = async (email: string): Promise<UserModel> => {
  const user = await prisma.user.findFirst({ where: { email: email } });

  if (!user) {
    throw new NotFoundException('User not found.');
  }
  return user;
};

const getUserByCpf = async (cpf: string): Promise<UserModel> => {
  const user = await prisma.user.findFirst({ where: { cpf: cpf } });

  if (!user) {
    throw new NotFoundException('User not found.');
  }
  return user;
};

const getUserById = async (userId: number): Promise<UserModel> => {
  const userFirst = await prisma.user.findFirst({ where: { id: userId } });

  if (!userFirst) {
    throw new NotFoundException('User not found.');
  }
  return userFirst;
};

const editPassword = async (
  userId: number,
  UserEditPasswor: UserEditPasswordDTO,
): Promise<UserModel> => {
  const user = await getUserById(userId);

  const newUser = {
    ...user,
    password: await createPaswwordHashed(UserEditPasswor.password),
  };

  return prisma.user.update({
    where: { id: userId },
    data: newUser,
  });
};

export { getUsers, createUser, getUserByEmail, getUserByCpf, getUserById, editPassword };
