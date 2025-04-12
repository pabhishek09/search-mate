import App from 'express';
import path from 'path';
import config from './appConfig';
import { health } from './server/index';

const app = App()
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
app.use('/api/health', health);

export default app;
