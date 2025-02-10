const pg = require('pg')
const { Pool } = pg
const pool = new Pool({
  host: 'localhost',
  user: 'sergius',
  password: 'jijojkl',
  port: 5432,
  database: 'blablachat',
})

module.exports = pool
