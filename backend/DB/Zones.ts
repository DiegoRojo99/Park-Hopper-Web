import db from './db';

export const insertZone = (zone: { ZoneName: string, ParkID: string }): Promise<number> => {
  return new Promise((resolve, reject) => {
    const { ZoneName, ParkID } = zone;
    const sql = `
      INSERT INTO Zones (ZoneName, ParkID) 
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE 
        ZoneName = VALUES(ZoneName)
    `;
    const values = [ZoneName, ParkID];

    db.query(sql, values, (err: any, result: any) => {
      if (err) {
        reject(err);
      } else {
        if (result.insertId) {
          // If a new row was inserted, result.insertId will contain the new ZoneID
          resolve(result.insertId);
        } else {
          // If an existing row was updated, we need to retrieve the ZoneID manually
          const selectSql = `
            SELECT ZoneID FROM Zones WHERE ZoneName = ? AND ParkID = ?
          `;
          const selectValues = [ZoneName, ParkID];

          db.query(selectSql, selectValues, (selectErr: any, selectResult: any) => {
            if (selectErr) {
              reject(selectErr);
            } else {
              resolve(selectResult[0].ZoneID);
            }
          });
        }
      }
    });
  });
};

