import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'; // Import cors middleware
import { addDestination, getAllParks } from './functions';
import {syncDestinationsWithDB, syncParksWithQueueTimesDB} from './Activities/Sync';
import {processParks} from './Activities/loadAttractionsAndZones';

const app = express();
const PORT = 8000;

app.use(bodyParser.json());
app.use(cors()); // Use cors middleware to enable CORS for all routes

app.post('/api/destinations', addDestination);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/api/allParks', getAllParks);

app.get('/api/syncAttractions', processParks);
app.get('/api/syncDestinations', async (req, res) => {
  try {
    const apiUrl = 'https://api.themeparks.wiki/v1/destinations';
    const success = await syncDestinationsWithDB(apiUrl);
    
    if (success) {
      res.status(200).send("Sync completed successfully");
    } else {
      res.status(400).send("Sync failed");
    }
  } catch (error) {
    console.error("Error syncing destinations:", error);
    res.status(500).send("Internal server error");
  }
});
app.get('/api/syncParks', async (req, res) => {
  try {
    const apiUrl = 'https://queue-times.com/parks.json';
    const success = await syncParksWithQueueTimesDB(apiUrl);
    
    if (success) {
      res.status(200).send("Sync completed successfully");
    } else {
      res.status(400).send("Sync failed");
    }
  } catch (error) {
    console.error("Error syncing destinations:", error);
    res.status(500).send("Internal server error");
  }
});