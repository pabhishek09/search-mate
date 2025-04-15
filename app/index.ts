import App from 'express';
import path from 'path';
import config from './appConfig';
import health, { chatStream, getInstalledModels } from './server/index';
import bodyParser from 'body-parser';
import winston from 'winston';

const app = App()
app.use(bodyParser.json());

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'search-mate' },
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
  });
  if (process.env.NODE_ENV === 'development') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple(),
    }));
  }
  
const { PORT, NODE_ENV } = config;

console.log(`NODE_ENV: ${NODE_ENV}`);

if (NODE_ENV === 'production') {
    // Serve static files of the react web application
    app.use(App.static(path.join(__dirname, 'web', 'build')));

    app.get('/', (req, res) => {
        // Serve the index.html file from the build directory
        res.sendFile(path.join(__dirname, 'web', 'build', 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// use server routes
app.get('/api/health', health);
app.get('/api/models', getInstalledModels);
app.post('/api/chat', chatStream);

export default app;
