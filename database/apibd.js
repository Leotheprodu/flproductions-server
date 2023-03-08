const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql2");
const credentials = require("./dbconnections")
const connection = mysql.createConnection(credentials);

app.use(cors({
  origin: "http://localhost:5173", // use your actual domain name (or localhost), using * is not recommended
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
  credentials: true
}));
app.use(express.json());

app.get("/api/artistas", (req, res) => {
    connection.query('SELECT * FROM artistas', (error, result) =>{
      if(error) {
        res.status(500).send(error);
      }else {
        res.status(200).json({ artistas: result });
      }
    });
  
  });
  app.get("/api/artistas/producciones", (req, res) => {
    connection.query('SELECT producciones.*, artistas.nombre_artista, artistas.instagram, artistas.imagen FROM producciones INNER JOIN artistas ON producciones.id_artista = artistas.id ORDER BY producciones.fecha_lanzamiento DESC', (error, result) =>{
      if(error) {
        /* res.status(500).send(error); */
      }else {
        res.status(200).json({ producciones: result });
      }
    });
  });
  
  app.get("/api/artistas/:artista", (req, res) => {
    const artista = req.params.artista
    connection.query(`SELECT artistas.nombre_artista, producciones.nombre FROM artistas INNER JOIN producciones ON artistas.id = producciones.id_artista WHERE artistas.nombre_artista = ${artista}`, (error, result) =>{
      if(error) {
        /* res.status(500).send(error); */ 
      }else {
        res.status(200).json({artistas: result });
      }
    });
  
  });

  

  module.exports = app