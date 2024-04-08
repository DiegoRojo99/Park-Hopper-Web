import { Request, Response } from 'express';
import db from './db';

export const addDestination = (req: Request, res: Response) => {
    const { id, name, destinationDescription, latitude, longitude } = req.body;
  
    if (!name) {
      return res.status(400).json({ error: 'Destination name is required' });
    }
  
    const sql = 'INSERT INTO Destinations (DestinationID, DestinationName, DestinationDescription, Latitude, Longitude) VALUES (?, ?, ?, ?, ?)';
    const values = [id, name, destinationDescription || null, latitude || null, longitude || null];
  
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error inserting destination:', err);
        return res.status(500).json({ error: 'Error inserting destination' });
      }
      console.log('Destination added successfully:', result.insertId);
      res.status(201).json({ id: result.insertId });
    });
  };
  