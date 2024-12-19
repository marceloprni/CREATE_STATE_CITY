import { Router, Request, Response } from 'express';
import { AuthDTO } from './dtos/auth.dto';
import { validateAuth } from './auth.service';
import { ReturnError } from '@exceptions/dtos/return-error.dto';

const validaAuthController = async (
  req: Request<undefined, undefined, AuthDTO>,
  res: Response,
): Promise<void> => {
  const user = await validateAuth(req.body).catch((err) => {
    new ReturnError(res, err);
  });

  res.send(user);
};

const authRouter = Router();
const router = Router();

authRouter.use('/auth', router);

router.post('/', validaAuthController);

export default authRouter;
