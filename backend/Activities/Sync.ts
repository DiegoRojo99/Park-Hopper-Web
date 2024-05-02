import { destinationToDestinationDB, parkToParkDB } from '../Types/DTOs';
import { Destination, DestinationDB, Park, ParkGroup } from '../Types/Types';
import { addParkLocation, addParkToDB, insertDestination } from '../functions';

export async function syncDestinationsWithDB(apiUrl: string) {
  try {
    const response = await fetch(apiUrl);
    let apiCall: {destinations: Destination[]} = await response.json();
    let destinations: Destination[] = apiCall.destinations;
    for (const destination of destinations) {
      const destinationDB = destinationToDestinationDB(destination);
      await insertDestination(destinationDB);
      
      for (const park of destination.parks) {
        const parkDB = parkToParkDB(park, destination.id);
        await addParkToDB(parkDB);
      }
    }
    console.log("Sync completed successfully.");
    return true;
  } catch (error) {
    console.error("Error syncing destinations:", error);
    return false;
  }
}
export async function syncParksWithQueueTimesDB(apiUrl: string) {
  try {
    const response = await fetch(apiUrl);
    const parkGroups: ParkGroup[] = await response.json();

    for (const group of parkGroups) {
      for (const park of group.parks) {
        addParkLocation(park);
      }
    }

    console.log("Park synchronization completed successfully.");
    return true;
  } catch (error) {
    console.error("Error synchronizing parks:", error);
    return false;
  }
}
