import App from 'express';
import { config } from 'dotenv';

// Importing the config function from dotenv to load environment variables
config();


const app = App()
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
