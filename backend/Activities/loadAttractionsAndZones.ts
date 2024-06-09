import { ParkDB } from '../Types/Types';
import { getAllParks, pullParks } from '../functions'; // Import the function to fetch parks
import { Request, Response } from 'express';

// Function to fetch data from the first API (Queue Times API)
async function fetchQueueTimesData(parkId: number) {
  const url = `https://queue-times.com/parks/${parkId}/queue_times.json`;
  const response = await fetch(url);
  return response.json();
}

// Function to fetch data from the second API (pi.themeparks.wiki)
async function fetchThemeParksData(parkId: string) {
  const url = `https://api.themeparks.wiki/v1/entity/${parkId}/children`; 
  const response = await fetch(url);
  return response.json();
}

// Function to insert data into attractions and zones tables
async function insertAttractionsAndZonesData(park: ParkDB) {
  if(park.QueueTimesID && park.ParkID)
    try {
        const queueTimesData = await fetchQueueTimesData(park.QueueTimesID);
        const themeParksData = await fetchThemeParksData(park.ParkID);
        // console.log("QueueTimes: ", queueTimesData.lands[0].rides[0])
        // console.log("ThemeParks: ", themeParksData.children[0])
        let queueTimesAttractions: any[] = [];
        queueTimesData.lands.forEach((land: { rides: any; }) => queueTimesAttractions = [...queueTimesAttractions, ...land.rides]);
        queueTimesAttractions = [...queueTimesAttractions, ...queueTimesData.rides]
        const themeParksAttractions = themeParksData.children.filter((child: { entityType: string; }) => child.entityType==="ATTRACTION");

        // Call the function to synchronize attractions data
        const {synchronizedAttractions, unsyncedAttractions} = synchronizeAttractions(queueTimesAttractions, themeParksAttractions, park);
        // Log synchronized attractions
        console.log('Synchronized attractions:', synchronizedAttractions.length);
        console.log('Un Synced attractions:', unsyncedAttractions.length);


        console.log(`Data inserted for ${park.ParkName}`);
    } catch (error) {
        console.error(`Error inserting data for ${park.ParkName}:`, error);
    }
}

// Function to synchronize attractions data
function synchronizeAttractions(queueTimesAttractions: any[], themeParksAttractions: any[], park: ParkDB) {
  const synchronizedAttractions = [];
  const unsyncedAttractions = [];

  for (const queueTimesAttraction of queueTimesAttractions) {
    const matchingThemeParkAttraction = themeParksAttractions.find(themeParksAttraction =>
      queueTimesAttraction.name === themeParksAttraction.name
    );

    if (matchingThemeParkAttraction) {
      // Create a synchronized attraction object
      const synchronizedAttraction = {
        AttractionID: matchingThemeParkAttraction.id,
        DestinationID: park.DestinationID,
        ParkID: park.ParkID,
        AttractionName: queueTimesAttraction.name,
        Slug: matchingThemeParkAttraction.slug,
        AttractionDescription: '', // Attraction description
        QueueTimesID: queueTimesAttraction.id,
        ZoneID: null // Zone ID (to be filled later)
      };
      // console.log("Q: ", queueTimesAttraction)
      // console.log("T: ", matchingThemeParkAttraction)
      // console.log("M: ", synchronizedAttraction)
      // console.log("P: ", park)

      synchronizedAttractions.push(synchronizedAttraction);
    } 
    else {
      // Log attractions that are not matching
      unsyncedAttractions.push(queueTimesAttraction);
      console.log(`Attraction "${queueTimesAttraction.name}" not found in theme parks data.`);
    }
  }

  return {synchronizedAttractions, unsyncedAttractions};
}

// Function to fetch all parks from the database and call insertAttractionsAndZonesData for each park
export const processParks = async (req: Request, res: Response) => {
  try {
    const parks = await pullParks(); // Fetch all parks
    // Iterate over each park and call insertAttractionsAndZonesData function
    for (const park of parks) {
      await insertAttractionsAndZonesData(park);
    }
    res.status(200).json({ message: 'Data processing completed' });
  } catch (error) {
    console.error('Error processing parks:', error);
    res.status(500).json({ error: 'Error processing parks' });
  }
};