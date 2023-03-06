const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql2");
const credentials = require("./dbconnections")

app.use(cors({
  origin: "http://localhost:5173", // use your actual domain name (or localhost), using * is not recommended
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
  credentials: true
}));

app.get("/api/artistas", (req, res) => {
    const connection = mysql.createConnection(credentials);
    connection.query('SELECT * FROM artistas', (error, result) =>{
      if(error) {
        res.status(500).send(error);
      }else {
        res.status(200).send(result);
      }
    });
  
  });
  app.get("/api/artistas/producciones", (req, res) => {
    const connection = mysql.createConnection(credentials);
    connection.query('SELECT producciones.*, artistas.nombre_artista, artistas.instagram, artistas.imagen FROM producciones INNER JOIN artistas ON producciones.id_artista = artistas.id ORDER BY producciones.fecha_lanzamiento DESC', (error, result) =>{
      if(error) {
        res.status(500).send(error);
      }else {
        res.status(200).send(result);
      }
    });
  });
  
  app.get("/api/artistas/:artista", (req, res) => {
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
  
  app.get("/api/servicios", (req, res) => {
    const connection = mysql.createConnection(credentials);
    connection.query('SELECT * FROM servicios', (error, result) =>{
      if(error) {
        res.status(500).send(error);
      }else {
        res.status(200).send(result);
      }
    });
  });
  
  
  app.get("/api/servicios/precios", (req, res) => {
    const connection = mysql.createConnection(credentials);
    connection.query('SELECT * FROM servicios_precios', (error, result) =>{
      if(error) {
        res.status(500).send(error);
      }else {
        res.status(200).send(result);
      }
    });
  });
  app.get("/api/servicios/limitaciones", (req, res) => {
    const connection = mysql.createConnection(credentials);
    connection.query('SELECT * FROM servicios_limitaciones', (error, result) =>{
      if(error) {
        res.status(500).send(error);
      }else {
        res.status(200).send(result);
      }
    });
  });

  module.exports = app