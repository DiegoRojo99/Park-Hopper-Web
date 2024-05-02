
interface Destination {
  id: string;
  name: string;
  slug: string;
  parks: Park[];
}

interface DestinationDB {
  DestinationID: string;
  Slug: string;
  DestinationName: string;
  DestinationDescription?: string;
  Latitude: number;
  Longitude: number;
}

interface Park {
  id: string;
  name: string;
}

interface ParkDB {
  ParkID: string;
  DestinationID: string;
  ParkName: string;
  Slug: string;
  ParkDescription?: string;
  Latitude: number;
  Longitude: number;
}

export {
  Destination,
  DestinationDB,
  Park,
  ParkDB
}