const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const credentials = require("../database/dbconnections");
const connection = mysql.createConnection(credentials);
const bcrypt = require('bcrypt');
const saltRounds = 10;
const ejs = require('ejs');
const transporter = require("../database/emailcred");
const crypto = require('crypto');




router.get('/usuarios/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (id === req.session.user.id && req.session.isLoggedIn) {
    const query = `SELECT * FROM usuarios WHERE id = ?`;
    const values = [id];
    connection.query(query, values, (error, results, fields) => {
      if (error) {
        console.error(error);
      } else {
        const query2 = "SELECT role_id FROM role_users WHERE user_id = ?";
        const value = id;
        req.session.user = results[0];
        connection.query(query2, value, (error, results) => {
          if (error) {
            console.log(error)

          } else {
            req.session.roles = results.map(obj => obj.role_id).filter(val => val !== undefined);
            res.status(200).send({ message: "Datos de usuario generados con exito", isLoggedIn: true, user: req.session.user, roles: req.session.roles });
          }

        });

      }
    });
  } else {
    res.status(401).json({ message: "No tienes permiso para acceder a este recurso." });
  }

});


router.put('/actualizar-usuarios/:id', (req, res) => {

  const id = parseInt(req.params.id);
  const { username, email, password } = req.body;
  const token = crypto.randomBytes(32).toString('hex');// Genera un token aleatorio de 32 caracteres
  const link = `${process.env.NODE_ENV === 'production' ? 'https://flproductionscr.com/' : 'http://localhost:5000/'}api/verificar-correo/${token}`;
  const newTempToken = {
    token: token,
    user_email: email
  };
  let sql = 'UPDATE usuarios SET';
  let values = [];

  const emailHandle = () => {

    if (email !== req.session.user.email) {
      if (req.session.roles.includes(1)) {
        connection.query('DELETE FROM role_users WHERE user_id = ? AND role_id = ?', [id, 1], function (error, results, fields) {
          if (error) {
            console.error(error);
            res.status(500).json({ error: "Ha ocurrido un error al borrar el rol verificado del usuario" });
            return;
          }
          let array = req.session.roles;
          let valor = 1;
          let indice = array.indexOf(valor);
          if (indice !== -1) {
            array.splice(indice, 1);
          }
        });
      }

      connection.query('INSERT INTO temp_token_pool SET ?', newTempToken, function (error, results, fields) {
        if (error) {
          console.error(error);
          res.status(500).json({ error: "Ha ocurrido un error al guardar los el registro en temp_token_pool" });
          return;
        }
        ejs.renderFile(__dirname + '/sign_up.ejs', { username, link }, (error, data) => {
          if (error) {
            console.log(error);
            res.send(error);
          } else {
            const mailOptions = {
              from: 'FLProductions <no-responder@flproductionscr.com>', // Coloca el correo desde el que enviarás los correos
              to: email, // Coloca el correo del destinatario
              subject: 'Verifique su correo',
              html: data // Contenido HTML generado a partir de la plantilla
            };
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.log(error);
                res.send(error);
              } else {

              }
            });
          }
        });
      });

    }
    req.session.user.email = email;
  }

  const UpdateBD = () => {
    // Eliminar la coma sobrante al final de la cadena SQL
    sql = sql.slice(0, -1);

    // Agregar la cláusula WHERE a la cadena SQL
    sql += ' WHERE id = ?';
    values.push(id);

    connection.query(sql, values, (error, resultado) => {
      if (error) {
        console.error('Error al actualizar los datos: ', error);
        res.status(500).send('Error al actualizar los datos');
        return;
      }
      emailHandle();
      req.session.user.username = username;
      res.status(200).json({ message: "Datos Actualizados Exitosamente!", isLoggedIn: true, user: req.session.user, roles: req.session.roles });
    });
  }

  const hashpassword = async () => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Ha ocurrido un error con el password" });
        return;
      }
      // Agregar el hash al array values

      values.push(hash);

      // Agregar la columna3 hasheada a la cadena SQL
      sql += ' password = ?,';
      req.session.user.password = hash;
      UpdateBD();

    });
  }

  if (username !== null) {
    sql += ' username = ?,';
    values.push(username);
  }
  if (email !== null) {
    sql += ' email = ?,';
    values.push(email);
  }
  if (password !== null) {
    // Hashea el password utilizando bcrypt
    hashpassword();
    return;
  }

  UpdateBD();

});

router.get('/verificar-email/:email', (req, res) => {
const username = req.session.user.username;
  const email = req.params.email;
  console.log(email);
  const token = crypto.randomBytes(32).toString('hex');// Genera un token aleatorio de 32 caracteres
  const link = `${process.env.NODE_ENV === 'production' ? 'https://flproductionscr.com/' : 'http://localhost:5000/'}api/verificar-correo/${token}`;
  const newTempToken = {
    token: token,
    user_email: email
  };

  if (!req.session.roles.includes(1)) {
    
    connection.query('INSERT INTO temp_token_pool SET ?', newTempToken, function (error, results, fields) {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Ha ocurrido un error al guardar los el registro en temp_token_pool" });
        return;
      }
      ejs.renderFile(__dirname + '/sign_up.ejs', { username , link }, (error, data) => {
        if (error) {
          console.log(error);
          res.send(error);
        } else {
          const mailOptions = {
            from: 'FLProductions <no-responder@flproductionscr.com>', // Coloca el correo desde el que enviarás los correos
            to: email, // Coloca el correo del destinatario
            subject: 'Verifique su correo',
            html: data // Contenido HTML generado a partir de la plantilla
          };
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
              res.send(error);
            } else {

            }
          });
        }
      });
      res.status(200).json({ message: "Correo de Verificacion Enviado" });
    });

  } else{
    res.status(401).json({ error: "Debes haber iniciado sesion" });
  }


});


module.exports = router;