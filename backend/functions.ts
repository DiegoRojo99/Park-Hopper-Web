import { Request, Response } from 'express';
import db from './DB/db';
import { DestinationDB, Park, ParkDB, QueuePark } from './Types/Types';

export const addDestination = (req: Request, res: Response) => {
  const { id, slug, name, destinationDescription, latitude, longitude } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Destination name is required' });
  }

  const destination: DestinationDB = {
    DestinationID: id,
    Slug: slug || null,
    DestinationName: name,
    DestinationDescription: destinationDescription || "",
    Latitude: latitude || null,
    Longitude: longitude || null
  };
  
  insertDestination(destination)
  .then((insertId) => {
      console.log('Destination added successfully:', insertId);
      res.status(201).json({ id: insertId });
  })
  .catch((error) => {
      console.error('Error inserting destination:', error);
      res.status(500).json({ error: 'Error inserting destination' });
  });
};

export const insertDestination = (destination: DestinationDB): Promise<void> => {
  return new Promise((resolve, reject) => {
    const { DestinationID, Slug, DestinationName, DestinationDescription, Latitude, Longitude } = destination;
    const sql = `
      INSERT INTO Destinations (DestinationID, Slug, DestinationName, DestinationDescription, Latitude, Longitude) 
      VALUES (?, ?, ?, ?, ?, ?) 
      ON DUPLICATE KEY UPDATE 
        DestinationName = VALUES(DestinationName)
    `;
    const values = [DestinationID, Slug, DestinationName, DestinationDescription, Latitude, Longitude];
    db.query(sql, values, (err: any, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.insertId);
      }
    });
  });
};

export const addParkToDB = (park: ParkDB): Promise<void> => {
  return new Promise((resolve, reject) => {
    const { ParkID, DestinationID, ParkName, Slug, ParkDescription, Latitude, Longitude } = park;
    const sql = `
      INSERT INTO Parks (ParkID, DestinationID, ParkName, Slug, ParkDescription, Latitude, Longitude) 
      VALUES (?, ?, ?, ?, ?, ?, ?) 
      ON DUPLICATE KEY UPDATE 
        ParkName = VALUES(ParkName)
    `;
    const values = [ParkID, DestinationID, ParkName, Slug, ParkDescription || null, Latitude, Longitude];

    db.query(sql, values, (err: any, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export const addParkLocation = (park: QueuePark): Promise<void> => {
  return new Promise((resolve, reject) => {
    const { id, name, country, continent, latitude, longitude } = park;
    const sql = `
      UPDATE Parks 
      SET 
        Country = ?,
        Continent = ?,
        Latitude = CAST(? AS FLOAT),
        Longitude = CAST(? AS FLOAT),
        QueueTimesID = ?
      WHERE 
        ParkName = ?
    `;
    const values = [country, continent, latitude, longitude, id, name];

    db.query(sql, values, (err: any, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export const getAllParks = (req: Request, res: Response) => {
  const sql = `
    SELECT *
    FROM Parks
  `;

  db.query(sql, (err: any, results: any) => {
    if (err) {
      console.error('Error getting parks:', err);
      return res.status(500).json({ error: 'Error getting parks' });
    }

    res.status(200).json(results);
  });
};

export const pullParks = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT *
      FROM Parks
    `;

    db.query(sql, (err: any, results: any) => {
      if (err) {
        console.error('Error getting parks:', err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};