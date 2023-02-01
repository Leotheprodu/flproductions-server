const express = require("express");
const apibd = express();
const mysql = require("mysql2");
const cors = require("cors");
const credentials = require("./dbconnections")

apibd.use(cors());

apibd.get("/api/artistas", (req, res) => {
    const connection = mysql.createConnection(credentials);
    connection.query('SELECT * FROM artistas', (error, result) =>{
      if(error) {
        res.status(500).send(error);
      }else {
        res.status(200).send(result);
      }
    });
  
  });
  apibd.get("/api/artistas/producciones", (req, res) => {
    const connection = mysql.createConnection(credentials);
    connection.query('SELECT producciones.*, artistas.nombre_artista, artistas.instagram, artistas.imagen FROM producciones INNER JOIN artistas ON producciones.id_artista = artistas.id ORDER BY producciones.id DESC', (error, result) =>{
      if(error) {
        res.status(500).send(error);
      }else {
        res.status(200).send(result);
      }
    });
  });
  
  apibd.get("/api/artistas/:artista", (req, res) => {
    const artista = req.params.artista
    const connection = mysql.createConnection(credentials);
    connection.query(`SELECT artistas.nombre_artista, producciones.nombre FROM artistas INNER JOIN producciones ON artistas.id = producciones.id_artista WHERE artistas.nombre_artista = ${artista}`, (error, result) =>{
      if(error) {
        res.status(500).send(error); 
      }else {
        res.status(200).send(result);
      }
    });
  
  });
  
  apibd.get("/api/servicios", (req, res) => {
    const connection = mysql.createConnection(credentials);
    connection.query('SELECT * FROM servicios', (error, result) =>{
      if(error) {
        res.status(500).send(error);
      }else {
        res.status(200).send(result);
      }
    });
  });
  
  
  apibd.get("/api/servicios/precios", (req, res) => {
    const connection = mysql.createConnection(credentials);
    connection.query('SELECT * FROM servicios_precios', (error, result) =>{
      if(error) {
        res.status(500).send(error);
      }else {
        res.status(200).send(result);
      }
    });
  });
  apibd.get("/api/servicios/limitaciones", (req, res) => {
    const connection = mysql.createConnection(credentials);
    connection.query('SELECT * FROM servicios_limitaciones', (error, result) =>{
      if(error) {
        res.status(500).send(error);
      }else {
        res.status(200).send(result);
      }
    });
  });
 

  module.exports = apibd