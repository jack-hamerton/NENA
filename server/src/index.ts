
import express from 'express';
import connectionsRouter from './routes/connections';

const app = express();
const port = process.env.PORT || 3001;

app.use('/api/connections', connectionsRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
