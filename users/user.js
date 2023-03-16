const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const credentials = require("../database/dbconnections");
const connection = mysql.createConnection(credentials);





router.get('/usuarios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (id === req.session.user.id && req.session.isLoggedIn) {
      const query = `SELECT * FROM usuarios WHERE id = ?`;
      const values = [id];
      connection.query(query, values, (error, results, fields) => {
        if (error) {
          console.error(error);
        } else {
            const query2 = "SELECT role_id FROM role_users WHERE user_id = ?";
            const value = id;
            req.session.user = results[0];
            connection.query(query2, value, (error, results) => {
              if (error) {
                console.log(error)
    
              } else {
                req.session.roles = results.map(obj => obj.role_id).filter(val => val !== undefined);
                res.status(200).send({ message: "Datos de usuario generados con exito", isLoggedIn: true, user: req.session.user, roles: req.session.roles });
              }
    
            });
          
        }
      });
    } else {
      res.status(401).json({ message: "No tienes permiso para acceder a este recurso." });
    }
  
  });

  module.exports = router;