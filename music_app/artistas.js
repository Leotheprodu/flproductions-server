const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const credentials = require("../database/dbconnections")
const connection = mysql.createConnection(credentials);



router.get("/artistas", (req, res) => {
    connection.query('SELECT * FROM artistas', (error, result) =>{
      if(error) {
        res.status(500).send(error);
      }else {
        res.status(200).json({ artistas: result });
      }
    });
  
  });
  router.get("/artistas/producciones", (req, res) => {
    connection.query('SELECT producciones.*, artistas.nombre_artista, artistas.instagram, artistas.imagen FROM producciones INNER JOIN artistas ON producciones.id_artista = artistas.id ORDER BY producciones.fecha_lanzamiento DESC', (error, result) =>{
      if(error) {
        /* res.status(500).send(error); */
      }else {
        res.status(200).json({ producciones: result });
      }
    });
  });
  
  router.get("/artistas/:artista", (req, res) => {
    const artista = req.params.artista
    connection.query(`SELECT artistas.nombre_artista, producciones.nombre FROM artistas INNER JOIN producciones ON artistas.id = producciones.id_artista WHERE artistas.nombre_artista = ${artista}`, (error, result) =>{
      if(error) {
        /* res.status(500).send(error); */ 
      }else {
        res.status(200).json({artistas: result });
      }
    });
  
  });

  

  module.exports = router;