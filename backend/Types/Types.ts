
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

interface ParkGroup {
  id: number;
  name: string;
  parks: QueuePark[];
}

interface QueuePark {
  id: number;
  name: string;
  country: string;
  continent: string;
  latitude: string;
  longitude: string;
}

export {
  Destination,
  DestinationDB,
  Park,
  ParkDB,
  ParkGroup,
  QueuePark
}