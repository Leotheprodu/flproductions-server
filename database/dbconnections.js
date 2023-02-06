
const credentials={
  host:'localhost',
  user: process.env.DB_USER || 'root',
  password:process.env.DB_PASS || 'Lsound2022',
  database: process.env.DB_DB || 'flproductions'
}

  module.exports = credentials;