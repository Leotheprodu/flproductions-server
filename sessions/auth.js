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


// Manejamos la solicitud de inicio de sesión
router.post("/login", (req, res) => {
  const { email, password } = req.body;


  // Creamos una consulta preparada con marcadores de posición
  const query = "SELECT * FROM usuarios WHERE email = ?";
  const values = [email];

  // Ejecutamos la consulta preparada con los valores de los marcadores de posición
  connection.query(query, values, (error, results) => {
    if (error) {
      // Enviamos una respuesta de error si hay un error en la consulta
      res.status(500).json({ message: "Error en la consulta, el usuario no existe" });
    } else if (results.length === 1) {
      //buscamos los roles del usuario y lo almacenamos en la sesion
      const rolesUsuario = (id) => {
        const query = "SELECT role_id FROM role_users WHERE user_id = ?";
        const values = [id];
        connection.query(query, values, (error, results) => {

          if (error) {
            console.log(error)

          } else {
            req.session.roles = results.map(obj => obj.role_id).filter(val => val !== undefined);
          }

        });
      }

      rolesUsuario(results[0].id)

      // Comparamos el password hasheado almacenado en la base de datos con el password proporcionado en la solicitud de login
      bcrypt.compare(password, results[0].password, (error, isMatch) => {
        if (isMatch) {
          req.session.isLoggedIn = true;
          req.session.user = results[0];
          handlelogin();
        } else {
          // Enviamos una respuesta de error si las credenciales son inválidas
          res.status(401).json({ message: "el password no coincide con ningun registro" });
        }
      });
    } else {
      // Enviamos una respuesta de error si las credenciales son inválidas
      res.status(401).json({ message: "Credenciales inválidas, verifica y vuelve a intentar" });
    }

    function handlelogin() {
      if (process.env.NODE_ENV === 'production') {
        res.cookie("sessionId", req.session.id, { httpOnly: true, secure: true, maxAge: 3600000 }); // Establecemos la cookie de sesión

      } else {
        res.cookie("sessionId", req.session.id, { httpOnly: true, secure: false, maxAge: 3600000 });
      }
      res.status(200).json({ message: "Inicio de sesión exitoso!", isLoggedIn: true, user: req.session.user, roles: req.session.roles });

    }
  });
});

router.post("/logout", (req, res) => {

  req.session.isLoggedIn = false;
  res.status(200).json({ message: "Cierre de sesión exitoso!", isLoggedIn: false, user: req.session.user, roles: req.session.roles });
});

router.get("/check-session", (req, res) => {
  if (req.session.isLoggedIn) {
    res.status(200).send({ message: "El usuario ha iniciado sesion", isLoggedIn: true, user: req.session.user, roles: req.session.roles });
  } else {
    res.status(200).send({ message: "El usuario no ha iniciado sesion", isLoggedIn: false, user: {}, roles: [] });
  }
});

router.post("/signup", (req, res) => {
  const { email, password, username, fecha_creacion } = req.body;
  const query = "SELECT * FROM usuarios WHERE email = ?";
  const values = [email];
  const token = crypto.randomBytes(32).toString('hex');// Genera un token aleatorio de 32 caracteres
  const link = `${process.env.NODE_ENV === 'production' ? 'https://flproductionscr.com/' : 'http://localhost:5000/'}api/verificar-correo/${token}`;
  const newTempToken = {
    token: token,
    user_email: email
  };
  connection.query(query, values, (error, results) => {
    if (error) {
      // Enviamos una respuesta de error si hay un error en la consulta
      res.status(500).json({ message: "Ha ocurrido un error al verificar el correo" });

      // revisamos que el correo no exista en la bd
    } else if (results.length >= 1 || req.session.isLoggedIn) {
      res.status(403).json({ message: "Correo ya existe" });
      return;
    } else {
      // Hashea el password utilizando bcrypt
      bcrypt.hash(password, saltRounds, function (err, hash) {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Ha ocurrido un error con el password" });
          return;
        }

        // Crea un objeto con los datos del nuevo usuario y el password hasheado
        const newUser = {
          username: username,
          password: hash,
          email: email,
          fecha_creacion: fecha_creacion
        };

        // Inserta el nuevo usuario en la tabla de usuarios

        connection.query('INSERT INTO usuarios SET ?', newUser, function (error, results, fields) {
          if (error) {
            console.error(error);
            res.status(500).json({ error: "Ha ocurrido un error al guardar los el registro" });
            return;
          }
          connection.query('INSERT INTO temp_token_pool SET ?', newTempToken, function (error, results, fields) {
            if (error) {
              console.error(error);
              res.status(500).json({ error: "Ha ocurrido un error al guardar los el registro en temp_token_pool" });
              return;
            }
          });
          res.status(200).json({ message: "Usuario creado con éxito" });
          // Renderiza la plantilla con la variable del enlace
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
                  res.send('Correo enviado');

                }
              });
            }
          });

        });

      });
    }


  });


});

router.get('/verificar-correo/:token', (req, res) => {
  const token = req.params.token;
  const query = "SELECT * FROM temp_token_pool WHERE token = ?";

  connection.query(query, token, (error, results) => {
    if (error) {
      
      res.status(500).json({ message: "Ha ocurrido un error al verificar el correo" });

      //buscamos en correo en la tabla de usuarios
    } else if (results.length === 1) {
      const email = results[0].user_email
      const query2 = "SELECT * FROM usuarios WHERE email = ?";
      connection.query(query2, email, (error, results) => {
        if (error) {
          
          res.status(500).json({ message: "Ha ocurrido un error al consultar el correo en los usuarios" });
    
          // agregamos el rol de verificado al usuario
        } else {
          const id = results[0].id;
          const rolVerificado = {
            user_id: id,
            role_id: 1
          }
          connection.query('INSERT INTO role_users SET ?', rolVerificado, function (error, results, fields) {
            if (error) {
              console.error(error);
              res.status(500).json({ error: "Ha ocurrido un error al guardar los el registro en temp_token_pool" });
              return;

              // borramos el token pues ya fue verificado
            }else {
              connection.query('DELETE FROM temp_token_pool WHERE user_email = ?', email, function (error, results, fields) {
                if (error) {
                  console.error(error);
                  res.status(500).json({ error: "Ha ocurrido un error al guardar los el registro en temp_token_pool" });
                  return;
                }else {
                  //enviamos la respuesta al cliente
                  const miHtml = `<!DOCTYPE html>
                  <html>
                    <head>
                      <title>Correo Verificado</title>
                      <style>
                        body {
                          text-align: center;
                          font-family: Arial, sans-serif;
                          background-color: #f2f2f2;
                        }
                        
                        h1 {
                          color: #ebc246;
                          font-size: 3rem;
                          margin-top: 50px;
                        }
                        
                        p {
                          font-size: 1.2rem;
                          margin-top: 20px;
                        }
                      </style>
                    </head>
                    <body>
                      <h1>Se ha verificado su correo</h1>
                      <p>Ya puedes cerrar esta ventana</p>
                    </body>
                  </html>`;
                  res.setHeader('Content-Type', 'text/html');
                  res.send(miHtml);
                }
              });
            }
          });

        }
    
      });

    }

  });




});


module.exports = router;