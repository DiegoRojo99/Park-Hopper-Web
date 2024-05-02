import { Request, Response } from 'express';
import db from './db';
import { DestinationDB, ParkDB } from './Types/Types';

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

export const checkDestinationExistsInDB = (destinationID: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT COUNT(*) AS count FROM Destinations WHERE DestinationID = ?';
    db.query(sql, [destinationID], (err: any, result: any) => {
      if (err) {
        console.error('Error querying database:', err);
        reject(err);
      } else {
        console.log('Query result:', result); // Log the result to see its structure
        resolve(result[0].count > 0);
      }
    });
  });
};


export const checkParkExistsInDB = (parkID: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT COUNT(*) AS count FROM Parks WHERE ParkID = ?';
    db.query(sql, [parkID], (err: any, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(result[0].count > 0);
      }
    });
  });
};