import bodyParser from 'body-parser';
import 'dotenv/config.js';
import express from 'express';
import { errorHandler, errorLogger } from './src/middlewares/error.middlewares.js';
import marketStatusRouter from './src/routes/marketStatus.route.js';
import logger from './src/utils/logger.js';

const app = express();
const port = process.env.API_PORT;

app.get('/', (req, res) => {
  res.json({'message': 'ok'});
})

app.use('/market-status', marketStatusRouter);

app.use(bodyParser.json());
app.use(errorLogger);
app.use(errorHandler);

app.listen(port, () => {
  console.log("Server started...");
  logger.info(`Server started and running on port ${port}`)
});

