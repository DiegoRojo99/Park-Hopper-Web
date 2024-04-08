import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'; // Import cors middleware
import { addDestination } from './functions';

const app = express();
const PORT = 8000;

app.use(bodyParser.json());
app.use(cors()); // Use cors middleware to enable CORS for all routes

app.post('/api/destinations', addDestination);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
