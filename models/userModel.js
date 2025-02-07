const { Client } = require('pg');
const client = new Client();

client.connect();

const createUser = async (name, email) => {
  const query = 'INSERT INTO users(name, email) VALUES($1, $2)';
  await client.query(query, [name, email]);
};

module.exports = { createUser };
