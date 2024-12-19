import express from 'express';
import { routerLoader } from './routerLoader';

const app = express();

app.use(express.json()); // Habilita json

routerLoader(app);

app.listen(3333, (): void => {
  console.log('Servidor rodando na porta 3333');
});
