const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const credentials = require("../database/dbconnections");
const connection = mysql.createConnection(credentials);





router.get('/usuarios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (id === req.session.user_id && req.session.isLoggedIn) {
      const query = `SELECT id, username, email, fecha_creacion, ultima_actualizacion FROM usuarios WHERE id = ?`;
      const values = [id];
      connection.query(query, values, (error, results, fields) => {
        if (error) {
          console.error(error);
        } else {
          res.status(200).json({ user_data: results[0] });
  
        }
      });
    } else {
      res.status(401).json({ message: "No tienes permiso para acceder a este recurso." });
    }
  
  });

  module.exports = router;