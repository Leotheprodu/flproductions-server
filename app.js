/* DEPENDENCIAS */
const path = require("path");
const express = require("express");
const cors = require("cors");

/* Modulos */
const apibd =require("./database/apibd.js")
const login =require("./database/users.js")


/* variables */
const PUERTO = process.env.PORT || 5000;

const app = express();
app.use(apibd);
app.use(login);
app.use(cors());
app.use(express.static(path.resolve(__dirname, '../app/dist')));

// Manejar las peticiones GET en la ruta /api
app.get("/api", (req, res) => {
  res.redirect("/");
  
});

// Todas las peticiones GET que no hayamos manejado en las líneas anteriores retornaran nuestro app React
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../app/dist', 'index.html'));
});



app.listen(PUERTO, () => {
console.log(`El servidor esta escuchando en el puerto ${PUERTO}...`);

});