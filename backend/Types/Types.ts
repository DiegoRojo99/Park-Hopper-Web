
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
  Country?: string;
  Continent?: string;
  QueueTimesID?: number;
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

interface AttractionDB {
  AttractionID: string,
  DestinationID: string,
  ParkID: string,
  AttractionName: string,
  Slug: string,
  QueueTimesID: number,
  ZoneID: number | null
}

export {
  Destination,
  DestinationDB,
  Park,
  ParkDB,
  ParkGroup,
  QueuePark,
  AttractionDB
}