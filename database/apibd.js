const express = require("express");
const apibd = express();
const mysql = require("mysql2");
const credentials = require("./dbconnections")

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
    connection.query('SELECT * FROM producciones', (error, result) =>{
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