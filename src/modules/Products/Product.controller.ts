import { Router, Request, Response } from 'express';

const getProduct = (req: Request, res: Response): void => {
  res.send('Hello, User!');
};

const productRouter = Router();
const router = Router();

productRouter.use('product', router);

router.get('/', getProduct);

export default productRouter;
