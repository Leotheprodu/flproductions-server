const express = require("express");
const login = express();
const mysql = require("mysql2");
const cors = require("cors");
const credentials = require("./dbconnections")

login.use(cors());
login.use(express.json())
// Manejamos la solicitud de inicio de sesión
login.post("/api/login", (req, res) => {
    const connection = mysql.createConnection(credentials);
    const { email, password } = req.body;
  
    // Creamos una consulta preparada con marcadores de posición
    const query = "SELECT * FROM usuarios WHERE username = ? AND password = ?";
    const values = [email, password];
  
    // Ejecutamos la consulta preparada con los valores de los marcadores de posición
    connection.query(query, values, (error, results) => {
      if (error) {
        // Enviamos una respuesta de error si hay un error en la consulta
        res.status(500).json({ message: "Error en la consulta." });
      } else if (results.length === 1) {
        // Enviamos una respuesta exitosa si las credenciales son válidas
        res.status(200).json({ message: "Inicio de sesión exitoso!" });
      } else {
        // Enviamos una respuesta de error si las credenciales son inválidas
        res.status(401).json({ message: "Credenciales inválidas." });
      }
    });
  });

  module.exports = login;