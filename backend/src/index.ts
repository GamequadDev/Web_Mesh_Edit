import express from 'express';
import type { Request, Response } from 'express'; 

const app = express();
// ... reszta kodu
const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript działają wewnątrz Dockera! 🚀');
});

app.listen(PORT, () => {
  console.log(`Serwer biega na http://localhost:${PORT}`);
});