const express = require("express");
const router = express.Router();
const { getItems, createItem, getItem, updateItem, deleteItem } = require("../controllers/producciones");


/* Lista los items */
router.get("/", getItems);



module.exports = router;