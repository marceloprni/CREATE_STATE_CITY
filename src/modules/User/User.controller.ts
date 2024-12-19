import { Router, Request, Response } from 'express';
import { getUsers, createUser, editPassword } from './user.service';
import { UserInsertDTO } from './dtos/user-insert.dto';
import { NotFoundException } from '@exceptions/not-found-exception';
import { authAdminMiddleware } from '@middlewares/auth-admin.middlewares';
import { UserModel } from './User.model';
import { authMiddleware } from '@middlewares/auth.middleware';
import { UserEditPasswordDTO } from '@modules/auth/dtos/user-edit-password.dto';
import { ReturnError } from '@exceptions/dtos/return-error.dto';
import { getUserByToken } from '@utils/auth';

const createUserController = async (
  req: Request<undefined, undefined, UserInsertDTO>,
  res: Response,
): Promise<void> => {
  const user = await createUser(req.body);
  res.send(user);
};

const getUsersController = async (req: Request, res: Response): Promise<void> => {
  const users = await getUsers().catch((error) => {
    if (error instanceof NotFoundException) {
      res.status(404);
    } else {
      throw new Error(error);
    }
  });

  res.send(users);
};

const editPasswordController = async (
  req: Request<undefined, undefined, UserEditPasswordDTO>,
  res: Response,
): Promise<void> => {
  const userAuth = await getUserByToken(req);
  const user = await editPassword(userAuth.userId, req.body)
    .then((result) => result)
    .catch((error) => {
      new ReturnError(res, error);
    });

  res.send(user);
};

const userRouter = Router();
const router = Router();

userRouter.use('/user', router);

/* ROTA  */
router.post('/', createUserController);

/* ROTA COM MIDDLEWARES */
router.use(authMiddleware);
router.patch('/', editPasswordController);

/* ROTA COM MIDDLEWARES */
router.use(authAdminMiddleware);
router.get('/', getUsersController);

export default userRouter;
