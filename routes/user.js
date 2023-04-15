const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const credentials = require("../config/credentials");
const connection = mysql.createConnection(credentials);
const bcrypt = require('bcrypt');
const saltRounds = 10;
const ejs = require('ejs');
const transporter = require("../config/nodemailer/transporter");
const crypto = require('crypto');
const emailRateLimit = require("../config/nodemailer/emailRateLimit");
const rateLimit = require("../config/rate-limit");

router.use("/signup", rateLimit);



router.get('/:id', (req, res) => {
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
            console.log(error);

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

}); // seguridad: para conectarse el suario debe estar logueado

router.post('/recuperar-password', emailRateLimit, (req, res) => {
  const { email } = req.body;
  const token = crypto.randomBytes(6).toString('hex');// Genera un token aleatorio de 32 caracteres
  const newTempToken = {
    token: token,
    user_email: email,
    type: 'password'
  };

  connection.query('SELECT * FROM usuarios WHERE email = ?', email, function (error, results) {
    if (error) {
      console.error(error);
      res.status(500).json({ error: "Ha ocurrido un error al consultar en usuarios" });
      return;
    }
    if (results.length === 1) {

      connection.query('INSERT INTO temp_token_pool SET ?', newTempToken, function (error, results, fields) {
        if (error) {
          console.error(error);
          res.status(500).json({ error: "Ha ocurrido un error al guardar los el registro en temp_token_pool" });
          return;
        }
        ejs.renderFile(__dirname + '../config/nodemailer/templates/user-recuperar-password.ejs', { token }, (error, data) => {
          if (error) {
            console.log(error);
            res.send(error);
          } else {
            const mailOptions = {
              from: 'FLProductions <no-responder@flproductionscr.com>', // Coloca el correo desde el que enviarás los correos
              to: email, // Coloca el correo del destinatario
              subject: 'PIN para recuperar contraseña',
              html: data // Contenido HTML generado a partir de la plantilla
            };
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.log(error);
                res.send(error);
              } else {

                res.status(200).json({ message: "PIN Enviado" });
                /* connection.end(); */
                setTimeout(function () {
                  connection.query('DELETE FROM temp_token_pool WHERE user_email = ? AND type = ?', [email, 'password'], function (error, results, fields) {
                    if (error) {
                      console.error(error);
                      res.status(500).json({ error: "Ha ocurrido un error al borrar los el registro en temp_token_pool" });
                      return;
                    }
                  });
                }, 600000); // 600000 milisegundos = 10 minutos
              }
            });
          }
        });


      });

    } else {
      res.status(404).json({ message: "El email no esta en el sistema" });

    }

  });



}); // seguridad: envio de correos limitado

router.post('/recuperar-password-paso2', (req, res) => {
  const { email, password, pin } = req.body;

  connection.query('SELECT * FROM temp_token_pool WHERE token = ?', pin, function (err, resultados) {

    if (err) {
      console.error(err);
      res.status(500).json({ error: "Ha ocurrido un error al buscar el PIN" });

      return;
    }
    if (resultados.length === 1 && resultados[0].token === pin) {
      connection.query('SELECT * FROM usuarios WHERE email = ?', email, function (error, results) {
        if (error) {
          console.error(error);
          res.status(500).json({ error: "Ha ocurrido un error al consultar en usuarios" });
          return;
        }
        if (results.length === 1) {
          const hashpassword = async () => {
            bcrypt.hash(password, saltRounds, function (err, hash) {
              if (err) {
                console.error(err);
                res.status(500).json({ error: "Ha ocurrido un error con el password" });
                return;
              }


              connection.query('UPDATE usuarios SET password = ? WHERE id = ?', [hash, results[0].id], function (error, results) {
                if (error) {
                  console.error(error);
                  res.status(500).json({ error: "Ha ocurrido un error actualizando usuario" });
                  return;
                } else {

                  res.status(200).json({ message: "Datos Actualizados Exitosamente!" });
                }

              });


            });
          }
          hashpassword();


        } else {
          res.status(404).json({ message: "El email no esta en el sistema" });

        }

      });

    } else {
      res.status(404).json({ error: "El PIN ha caducado o es incorrecto" });
    }

  });

}); // seguridad: el pin enviado al correo del usuario esla seguridad

router.put('/actualizar-usuarios/:id', emailRateLimit, (req, res) => {

  const id = parseInt(req.params.id);
  const { username, email, password } = req.body;
  const token = crypto.randomBytes(32).toString('hex');// Genera un token aleatorio de 32 caracteres
  const link = `${process.env.NODE_ENV === 'production' ? 'https://flproductionscr.com/' : 'http://localhost:5000/'}api/verificar-correo/${token}`;
  const newTempToken = {
    token: token,
    user_email: email,
    type: 'role'
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
        ejs.renderFile(__dirname + '/verificar_correo.ejs', { username, link }, (error, data) => {
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

    if (req.session.isLoggedIn) {

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
    } else {
      res.status(403).send('debe haber iniciado session');
    }
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

}); // seguridad: solo usuarios con session inciada puede usar este endpoint

router.get('/verificar-email/:email', emailRateLimit, (req, res) => {
  const username = req.session.user.username;
  const email = req.params.email;
  const token = crypto.randomBytes(32).toString('hex');// Genera un token aleatorio de 32 caracteres
  const link = `${process.env.NODE_ENV === 'production' ? 'https://flproductionscr.com/' : 'http://localhost:5173/'}verificar-email/${token}`;
  const newTempToken = {
    token: token,
    user_email: email,
    type: 'role'
  };

  if (!req.session.roles.includes(1)) {

    connection.query('INSERT INTO temp_token_pool SET ?', newTempToken, function (error, results, fields) {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Ha ocurrido un error al guardar los el registro en temp_token_pool" });
        return;
      }
      ejs.renderFile(__dirname + '../config/nodemailer/templates/user-verificar_correo.ejs', { username, link }, (error, data) => {
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

  } else {
    res.status(401).json({ error: "Ya has verificado tu email" });
  }


}); // seguridad: envio de correos limitado

router.get('/avatar/:id', (req, res) => {

  const id = parseInt(req.params.id);

  connection.query('SELECT * FROM avatar_users WHERE user_id = ?', id, function (error, result) {
    if (error) {
      console.error(error);
      res.status(500).json({ error: "Ha ocurrido un error consultando los avatar" });
      return;
    }
    if (result.length === 1) {
      res.status(200).json({ message: "avatar encontrado", avatar: result[0].avatar });
    } else {
      res.status(200).json({ message: "avatar encontrado", avatar: 8 });
    }

  });


}); //seguridad: aun nos e me ocurre, porque los visitantes si deberia poder ver los avatar de los demas, por ejemplo en las respuestas

router.post('/avatar-update', (req, res) => {
  const { id, avatar } = req.body;
  const datosDeAvatar = [avatar, id];

  if (req.session.isLoggedIn && req.session.user.id === id) {

    connection.query('UPDATE avatar_users SET avatar = ? WHERE user_id = ?', datosDeAvatar, function (error, result) {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Ha ocurrido un error actualizando el avatar" });
        return;
      }
      if (result.changedRows === 1) {
        req.session.avatar = avatar;
        res.status(200).json({ message: "avatar actualizado" });

      } else {
        res.status(401).json({ message: "solo usuarios registrados pueden cambiar su avatar" });
      }

    });

  } else {
    res.status(401).json({ message: "Debes iniciar session para cambiar su avatar" });
  }
}); //seguridad: debe estar logueado y el id proporcionado deber ser el mismo de la sesion del usuario

router.get('/mensajes-generales', (req, res) => {

  connection.query('SELECT * FROM mensajes_generales', function (error, result) {
    if (error) {
      console.error(error);
      res.status(500).json({ error: "Ha ocurrido un error actualizando el avatar" });
      return;
    } else {
      res.status(200).json(result);
    }
  });

}); //seguridad: aun no se me ocurre, porque  estos mensajes son muy generales y hay para todo publico

router.post("/signup", emailRateLimit, (req, res) => {

  const { email, password, username, fecha_creacion } = req.body;
  const query = "SELECT * FROM usuarios WHERE email = ?";
  const values = [email];
  const token = crypto.randomBytes(32).toString('hex');// Genera un token aleatorio de 32 caracteres
  const link = `${process.env.NODE_ENV === 'production' ? 'https://flproductionscr.com/' : 'http://localhost:5173/'}verificar-email/${token}`;
  const newTempToken = {
    token: token,
    user_email: email,
    type: 'role'
  };
  connection.query(query, values, (error, results) => {
    if (error) {
      // Enviamos una respuesta de error si hay un error en la consulta
      res.status(500).json({ message: "Ha ocurrido un error al verificar el correo" });

      // revisamos que el correo no exista en la bd
    } else if (results.length === 1 || req.session.isLoggedIn) {
      res.status(403).json({ message: "Ya hay un usuario con ese correo" });
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
            res.status(500).json({ error: "Ha ocurrido un error al guardar la informacion del nuevo usuario en la tabla usuarios" });
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
          ejs.renderFile(__dirname + '../config/nodemailer/templates/user-sign_up.ejs', { username, link }, (error, data) => {
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


}); //seguridad: limitado a 5 intentos por ip, ademas limitado los correos enviados para que no envien mas de 1 por minuto

router.get('/verificar-correo/:token', (req, res) => {
  const token = req.params.token;
  const query = "SELECT * FROM temp_token_pool WHERE token = ? AND type = ?";

  connection.query(query, [token, 'role'], (error, results) => {
    if (error) {

      res.status(500).json({ message: "Ha ocurrido un error al verificar el correo" });

      //buscamos en correo en la tabla de usuarios
    } else if (results.length === 1) {
      const email = results[0].user_email;
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
            } else {
              connection.query('DELETE FROM temp_token_pool WHERE user_email = ? AND type = ?', [email, 'role'], function (error, results, fields) {
                if (error) {
                  console.error(error);
                  res.status(500).json({ error: "Ha ocurrido un error al guardar los el registro en temp_token_pool" });
                  return;
                } else {
                  const AvatarInfo = {
                    user_id: id,
                    avatar: 8
                  }
                  connection.query('INSERT INTO avatar_users SET ?', AvatarInfo, function (error, results, fields) {
                    if (error) {
                      console.error(error);
                      res.status(500).json({ error: "Ha ocurrido un error al guardar el avatar en la BD" });
                      return;
                    }
                    
                    //enviamos la respuesta al cliente
                    res.status(200).json({ message: "Correo verificado exitosamente" });
                  });
        

                }
              });
            }
          });

        }

      });

    } else if (results.length === 0) {
      res.status(403).json({ message: "El email ya ha sido verificado o debes volver a enviar un correo de verificacion" });
    }

  });




}); //seguridad: por si solo ya tiene una seguridad buena, pues solo si se tiene el token se puede hacer uso de esta api
module.exports = router;