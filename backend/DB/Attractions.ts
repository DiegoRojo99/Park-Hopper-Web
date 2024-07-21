import { AttractionDB } from '../Types/Types';
import db from './db';

export const insertAttraction = (attraction: AttractionDB): Promise<void> => {
  return new Promise((resolve, reject) => {
    const { AttractionID, DestinationID, ParkID, AttractionName, Slug, QueueTimesID, ZoneID } = attraction;
    let sql = `
      INSERT INTO Attractions (AttractionID, DestinationID, ParkID, AttractionName, Slug, QueueTimesID, ZoneID) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        AttractionName = VALUES(AttractionName)
    `;
    
    // Append conditional ZoneID update if ZoneID is provided
    if (ZoneID !== undefined && ZoneID !== null) {
      sql += `, ZoneID = VALUES(ZoneID)`;
    }

    const values = [AttractionID, DestinationID, ParkID, AttractionName, Slug || "", QueueTimesID, ZoneID ?? null];

    db.query(sql, values, (err: any, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
