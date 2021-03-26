const db = require('../db-connection');

const controllers = {
  getAll: (req, res) => {

    const sql = `SELECT * FROM albums`;

    db.all(sql, (err, rows) => {
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }

      res.json(rows)
    });
  },
  getOne: (req, res) => { 

    const sql = `SELECT * FROM albums WHERE AlbumId =  ${req.params.item}`;

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

    const sql = `SELECT * FROM albums WHERE Title =  "${req.params.item}"`;
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
   const sql = `INSERT into albums(AlbumId, Name)values((SELECT MAX(AlbumId) from albums)+1, "${re.name}")`;

   db.all(sql, (err, rows) => {
     if (err) {
       res.status(400).json({
         "error": err.message
       });
       return;
     }
     res.json({
       "message": "album added"
     })
   });
 },
 update: (req, res) => {
   // read row data from body
 },
 delete: (req, res) => {

   let sql = `SELECT * FROM albums WHERE AlbumId =${req.params.id}`;

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
       sql = `DELETE FROM albums WHERE AlbumId =${req.params.id}`;

       db.all(sql, (err, rows) => {
         if (err) {
           res.status(400).json({
             "error": err.message
           });
           return;
         }
         res.json({
           "message": "albums deleted"
         });
       });

     }

   });

 }
}

module.exports = controllers;
