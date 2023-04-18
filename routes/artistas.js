const express = require("express");
const router = express.Router();
const { getItems, createItem } = require("../controllers/artistas");
const mysql = require("mysql2");
const credentials = require("../config/credentials");
const { validatorCreateItem } = require("../validators/artistas");
const connection = mysql.createConnection(credentials);

router.get("/", getItems);
router.post("/", validatorCreateItem, createItem);


  router.get("/producciones", (req, res) => {
    connection.query('SELECT producciones.*, artistas.nombre_artista, artistas.instagram, artistas.imagen FROM producciones INNER JOIN artistas ON producciones.id_artista = artistas.id ORDER BY producciones.fecha_lanzamiento DESC', (error, result) =>{
      if(error) {
        /* res.status(500).send(error); */
      }else {
        res.status(200).json({ producciones: result });
      }
    });
  });
  
  router.get("/:artista", (req, res) => {
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