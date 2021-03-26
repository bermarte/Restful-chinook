const db = require('../db-connection');

const controllers = {
  getAll: (req, res) => {

    const sql = `SELECT * FROM media_types`;

    db.all(sql, (err, rows) => {
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }

      res.json(rows)
    });
  },
  getOne: (req, res) => {
    const sql = `SELECT * FROM media_types WHERE MediaTypeId =  ${req.params.item}`;

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

    const sql = `SELECT * FROM  WHERE Name =  "${req.params.item}"`;
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
    const sql = `INSERT into media_types(MediaTypeId, Name)values((SELECT MAX(MediaTypeId) from media_types)+1, "${re.name}")`;

    db.all(sql, (err, rows) => {
      if (err) {
        res.status(400).json({
          "error": err.message
        });
        return;
      }
      res.json({
        "message": "media_type added"
      })
    });
  },
  update: (req, res) => {
   // read row data from body
   const re = req.body;
   //first check if that item exists
   let sql = `SELECT * FROM media_types WHERE MediaTypeId =  ${req.params.id}`;

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
       sql = `UPDATE media_types SET Name="${re.name}" WHERE MediaTypeId = ${req.params.id}`;

       db.all(sql, (err, rows) => {
         if (err) {
           res.status(400).json({
             "error": err.message
           });
           return;
         }
         res.json({
           "message": "media_type changed"
         });
       });

     }
   });
  },
  delete: (req, res) => {

    let sql = `SELECT * FROM media_types WHERE MediaTypeId =${req.params.id}`;

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
        sql = `DELETE FROM media_types WHERE MediaTypeId =${req.params.id}`;

        db.all(sql, (err, rows) => {
          if (err) {
            res.status(400).json({
              "error": err.message
            });
            return;
          }
          res.json({
            "message": "media_type deleted"
          });
        });

      }

    });

  }
}

module.exports = controllers;