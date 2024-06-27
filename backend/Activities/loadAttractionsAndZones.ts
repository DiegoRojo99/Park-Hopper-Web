import { ParkDB } from '../Types/Types';
import { getAllParks, pullParks } from '../functions'; // Import the function to fetch parks
import { Request, Response } from 'express';
import {insertAttraction} from './../DB/Attractions';

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

async function insertAttractionsAndZonesData(park: ParkDB) {
  if(park.QueueTimesID && park.ParkID)
    try {
      const queueTimesData = await fetchQueueTimesData(park.QueueTimesID);
      const themeParksData = await fetchThemeParksData(park.ParkID);

      let queueTimesAttractions: any[] = [];
      queueTimesData.lands.forEach((land: { rides: any; }) => queueTimesAttractions = [...queueTimesAttractions, ...land.rides]);
      queueTimesAttractions = [...queueTimesAttractions, ...queueTimesData.rides]
      const themeParksAttractions: any[] = themeParksData.children.filter((child: { entityType: string; }) => child.entityType === "ATTRACTION");

      let {synchronizedAttractions, unsyncedAttractions} = synchronizeAttractions(queueTimesAttractions, themeParksAttractions, park);
      const exceptionWords = [
        " talk ","express", "meet", "restaurant", "musical", "virtualline", "station",
        " cafe ", " live", "aire de jeux", "playarea", "play area", "theatre", 
        "tour", "pool", "festival", "hotel", " show", "cinema", "playground",
        "dance", "flash mob", " band", " animals", "(ww)", "bus stop", "parade", 
      ];
      let unmatchedAttractions = themeParksAttractions.filter(att => !synchronizedAttractions.find(sa => sa.AttractionID === att.id ));

      unsyncedAttractions = unsyncedAttractions.filter(attraction => {
        return !exceptionWords.some(word => attraction.name.toLowerCase().includes(word));
      });
      unmatchedAttractions = unmatchedAttractions.filter(attraction => {
        return !exceptionWords.some(word => attraction.name.toLowerCase().includes(word));
      });

      if(unsyncedAttractions.length < 3 || unmatchedAttractions.length < 3 || (unsyncedAttractions.length < 5 && unmatchedAttractions.length < 5)){
        synchronizedAttractions.forEach(async element => {
          await insertAttraction(element);
        });
      }
      else if(unsyncedAttractions.length < 6  || unmatchedAttractions.length < 6){
        console.log(park.ParkName, "Less than 6");
      }
      else if(unsyncedAttractions.length < 10  && unmatchedAttractions.length < 10){
        console.log(park.ParkName, "Less than 10 both ways");
      }
      else{
        console.log("ELSE: ");
        console.log(park.ParkName, "is missing: ", unsyncedAttractions.map(a => a.name))
        console.log(park.ParkName, "is NOT matching: ", unmatchedAttractions.map(a => a.name))
      }
    } catch (error) {
      console.error(`Error inserting data for ${park.ParkName}:`, error);
    }
}

// Function to synchronize attractions data
function synchronizeAttractions(queueTimesAttractions: any[], themeParksAttractions: any[], park: ParkDB) {
  const synchronizedAttractions = [];
  const unsyncedAttractions = [];

  for (const queueTimesAttraction of queueTimesAttractions) {
    let matchingThemeParkAttraction = themeParksAttractions.find(
      themeParksAttraction => 
      queueTimesAttraction.name.toLowerCase() === themeParksAttraction.name.toLowerCase() ||
      queueTimesAttraction.name.toLowerCase().replace(/\s/g, '').trim() === themeParksAttraction.name.toLowerCase().replace(/\s/g, '').trim() ||
        queueTimesAttraction.name.toLowerCase().replace("carousel","carrousel").trim() === themeParksAttraction.name.toLowerCase().replace("carousel","carrousel").trim() ||
        queueTimesAttraction.name.toLowerCase().replace("ö","o").trim() === themeParksAttraction.name.toLowerCase().replace("ö","o").trim() ||
        queueTimesAttraction.name.toLowerCase().replace("awound","around").trim() === themeParksAttraction.name.toLowerCase().replace("awound","around").trim() ||
      queueTimesAttraction.name.toLowerCase().replace("'s","").trim() === themeParksAttraction.name.toLowerCase().replace("'s","").trim() ||
      queueTimesAttraction.name.toLowerCase().replace("’s","").trim() === themeParksAttraction.name.toLowerCase().replace("’s","").trim() ||
      queueTimesAttraction.name.toLowerCase().replace("’","'").replace("™","").trim() === themeParksAttraction.name.toLowerCase().replace("’","'").replace("™","").trim() ||
      queueTimesAttraction.name.toLowerCase().replace("'","").trim() === themeParksAttraction.name.toLowerCase().replace("'","").trim() ||
      queueTimesAttraction.name.toLowerCase().replace("'"," ").trim() === themeParksAttraction.name.toLowerCase().replace("'"," ").trim() ||
        queueTimesAttraction.name.toLowerCase().replace("*","").trim() === themeParksAttraction.name.toLowerCase().replace("*","").trim() ||
        queueTimesAttraction.name.toLowerCase().replace("™"," ").trim() === themeParksAttraction.name.toLowerCase().replace("™"," ").trim() ||
        queueTimesAttraction.name.toLowerCase().replace("™",":").trim() === themeParksAttraction.name.toLowerCase().replace("™",":").trim() ||
        queueTimesAttraction.name.toLowerCase().replace("™:", "").trim() === themeParksAttraction.name.toLowerCase().replace("™:", "").trim() ||
      queueTimesAttraction.name.toLowerCase().replace("-"," ").replace("™","").trim() === themeParksAttraction.name.toLowerCase().replace("™","").replace("-"," ").trim()
        
    );
    if(!matchingThemeParkAttraction){
      matchingThemeParkAttraction = themeParksAttractions.find(
        themeParksAttraction =>
          queueTimesAttraction.name === themeParksAttraction.id ||
          queueTimesAttraction.name === themeParksAttraction.externalId
      );
    }
    if(!matchingThemeParkAttraction){
      matchingThemeParkAttraction = themeParksAttractions.find(
        themeParksAttraction =>
          queueTimesAttraction.name.toLowerCase().includes(themeParksAttraction.name.toLowerCase()) ||
          themeParksAttraction.name.toLowerCase().includes(queueTimesAttraction.name.toLowerCase()) ||
          themeParksAttraction.name.toLowerCase().includes(queueTimesAttraction.name.toLowerCase()) ||
          (themeParksAttraction.name.toLowerCase().includes("carnival of chaos") && queueTimesAttraction.name.toLowerCase().includes("carnival of chaos")) ||
          queueTimesAttraction.name.replace(/\s/g, '').toLowerCase().includes(themeParksAttraction.name.replace(/\s/g, '').toLowerCase()) ||
          themeParksAttraction.name.replace(/\s/g, '').toLowerCase().includes(queueTimesAttraction.name.replace(/\s/g, '').toLowerCase())          
      );
    }

    if (matchingThemeParkAttraction) {
      const synchronizedAttraction = {
        AttractionID: matchingThemeParkAttraction.id,
        DestinationID: park.DestinationID,
        ParkID: park.ParkID,
        AttractionName: matchingThemeParkAttraction.name,
        Slug: matchingThemeParkAttraction.slug,
        AttractionDescription: '',
        QueueTimesID: queueTimesAttraction.id,
        ZoneID: null
      };
      synchronizedAttractions.push(synchronizedAttraction);
    }
    else {
      unsyncedAttractions.push(queueTimesAttraction);
      // console.log(`Attraction "${queueTimesAttraction.name}" not found in theme parks data.`);
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