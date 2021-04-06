const db = require('../db-connection');

const controllers = {

  getAll: (req, res) => {
    const sql = `SELECT * FROM tracks`;// LIMIT 21

    db.all(sql, (err, rows) => {
      if (err) {
        res.status(400).json({
          "error": err.message
        });
        return;
      }
      res.json(rows)

    });
  },
  getOne: (req, res) => {

    const sql = `SELECT * FROM tracks WHERE TrackId =  ${req.params.item}`;
    db.all(sql, (err, rows) => {

      if (err) {
        console.log(`id ${req.params.item} not found`)
        //if search by id fails, try search by name, instead
        try {
          return controllers.getOneByName(req, res);
        } catch (e) {
          res.status(400).json({
            "error": err.message
          });
          return;
        }
      }
      if (rows.length === 0) return res.json({
        "error": "no data found"
      });
      res.json(rows);
    });
  },
  getOneByName: (req, res) => {

    const sql = `SELECT * FROM tracks WHERE Name =  "${req.params.item}"`;
    db.all(sql, (err, rows) => {
      if (err) {
        res.status(400).json({
          "error": err.message
        });
        return;
      }

      if (rows.length === 0) return res.json({
        "error": "no data found"
      });
      res.json(rows)

    });
  },
  create: (req, res) => {
    // read row data from body
    const re = req.body;
    const sql = `INSERT into tracks(TrackId, Name, AlbumId, MediaTypeId, GenreId, Composer, Milliseconds, Bytes, UnitPrice) values((SELECT MAX(TrackId) from tracks)+1, "${re.name}", ${re.album}, ${re.media}, ${re.genre}, "${re.composer}", ${re.time}, ${re.bytes}, ${re.price} )`;

    db.all(sql, (err, rows) => {
      if (err) {
        res.status(400).json({
          "error": err.message
        });
        return;
      }
      res.json({
        "message": "track added"
      })
    });
  },
  update: (req, res) => {
    // read row data from body
    const re = req.body;
    //first check if that item exists
    let sql = `SELECT * FROM tracks WHERE TrackId =  ${req.params.id}`;

    db.all(sql, (err, rows) => {
      if (err) {
        res.status(400).json({
          "error": err.message
        });
        return;
      }
      if (rows.length === 0) return res.json({
        "error": "no data found"
      });
      
      else {

        //there's an item with that id, it's okay to modify it
        sql = `UPDATE tracks SET Name="${re.name}", AlbumId=${re.album},
        MediaTypeId=${re.media}, GenreId=${re.genre}, Composer="${re.composer}", Milliseconds=${re.time}, Bytes=${re.bytes}, UnitPrice=${re.price} WHERE TrackId = ${req.params.id}`;
        db.all(sql, (err, rows) => {
          if (err) {
            res.status(400).json({
              "error": err.message
            });
            return;
          }
          res.json({
            "message": "track changed"
          });
        });

      }
    });
  },
  delete: (req, res) => {
    let sql = `SELECT * FROM tracks WHERE TrackId =${req.params.id}`;

    db.all(sql, (err, rows) => {
      if (err) {
        res.status(400).json({
          "error": err.message
        });
        return;
      }
      //selection is null, no id was found
      if (rows.length === 0) return res.json({
        "error": "no data found"
      })

      else {

        //there's an item with that id, it's okay to delete it
        sql = `DELETE FROM tracks WHERE TrackId =${req.params.id}`;

        db.all(sql, (err, rows) => {
          if (err) {
            res.status(400).json({
              "error": err.message
            });
            return;
          }
          res.json({
            "message": "track deleted"
          });
        });

      }

    });
  }
}

module.exports = controllers;