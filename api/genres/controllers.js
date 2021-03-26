const db = require('../db-connection');

const controllers = {
  getAll: (req, res) => {

    const sql = `SELECT * FROM genres`;

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

    const sql = `SELECT * FROM genres WHERE genreId =  ${req.params.item}`;

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

    // For AC/DC write AC%2FDC for it to work on the routes

    const sql = `SELECT * FROM genres WHERE Name =  "${req.params.item}"`;
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
    const sql = `INSERT into genres(genreId, Name)values((SELECT MAX(genreId) from genres)+1, "${re.name}")`;

    db.all(sql, (err, rows) => {
      if (err) {
        res.status(400).json({
          "error": err.message
        });
        return;
      }
      res.json({
        "message": "genre added"
      })
    });
  },
  update: (req, res) => {
    // read row data from body
    const re = req.body;
    //first check if that item exists
    let sql = `SELECT * FROM genres WHERE genreId =  ${req.params.id}`;

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
        sql = `UPDATE genres SET Name="${re.name}" WHERE genreId = ${req.params.id}`;

        db.all(sql, (err, rows) => {
          if (err) {
            res.status(400).json({
              "error": err.message
            });
            return;
          }
          res.json({
            "message": "genre changed"
          });
        });

      }
    });
  },
  delete: (req, res) => {

    let sql = `SELECT * FROM genres WHERE genreId =${req.params.id}`;

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
        sql = `DELETE FROM genres WHERE genreId =${req.params.id}`;

        db.all(sql, (err, rows) => {
          if (err) {
            res.status(400).json({
              "error": err.message
            });
            return;
          }
          res.json({
            "message": "genre deleted"
          });
        });

      }

    });

  }
}

module.exports = controllers;