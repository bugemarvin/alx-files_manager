import express from 'express';
import Route from './routes/index';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(Route);

app.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log(`Server running on port ${PORT}`);
});

export default app;
