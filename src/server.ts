import express, { Request, Response } from 'express';
import { errorMiddleware } from './utils/exceptions/errorMiddleware';
const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send(`Hey Balaji 😘, your backend is alive and thriving!`);
});
app.use(errorMiddleware)
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});