const db = require('../db-connection');

const controllers = {

    getCustomer: (req, res) => {
        const sql = `SELECT * FROM customers`;
        db.all(sql, [], (err, rows) => {

            if (err) {
                res.status(400).json({
                    "error": err.message
                });
            }

            return res.json({
                status: true,
                customers: rows,
            });
        });

    },

    //Login
    getCustomerByEmail: (req, res) => {
        if (isEmpty(req.body.email) || isEmpty(req.body.password)) {
            return res.json({
                status: false,
                message: "All fields are required",
            });
        }
        let sql = `SELECT id, firstName, lastName where email='${req.body.email}' ALTER TABLE Customers ADD COLUMN Passwords`;
        db.all(sql, [], (err, rows) => {
                if (err) {
                    throw err;
                }
                db.close();
                if (rows.length == 0) {
                    return res.status(401).json({
                        status: false,
                        message: "Sorry, wrong email",
                    });
                } else if (rows.length == 0) {
                    return res.status(200).json({
                        status: true,
                        customers: rows,
                    });
                }

            },
        }
    },
}


// getCustomerByPassword: (req, res) => {
// if (isEmpty(req.body.email) || isEmpty(req.body.password)) {
//     return res.json({
//         status: false,
//         message: "All fields are required",
//     });
// }
// let sql = `SELECT id, firstName, lastName where email='${req.body.email}' and password='${req.body.password}'
// ALTER TABLE Customers ADD COLUMN Passwords`;
// db.all(sql, [], (err, rows) => {
//     if (err) {
//         throw err;
//     }
//     db.close();
//     if (rows.length == 0) {
//         return res.status(401).json({
//             status: false,
//             message: "Sorry, wrong email",
//         });
//     }
// });
//},

module.exports = controllers;