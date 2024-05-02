import { Destination, DestinationDB, Park, ParkDB } from "./Types";

function destinationToDestinationDB(destination: Destination): DestinationDB {
  const { id, name, slug, parks } = destination;

  return {
      DestinationID: id,
      Slug: slug,
      DestinationName: name,
      DestinationDescription: "",
      Latitude: 0,
      Longitude: 0
  };
}

function parkToParkDB(park: Park, destinationID: string): ParkDB {
  const { id, name } = park;

  return {
      ParkID: id,
      DestinationID: destinationID,
      ParkName: name,
      Slug: "",
      ParkDescription: "", 
      Latitude: 0,
      Longitude: 0
  };
}

export {
  destinationToDestinationDB,
  parkToParkDB
}