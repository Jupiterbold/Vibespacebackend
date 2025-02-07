const { Client } = require('pg');
const client = new Client();

client.connect();

const createMessage = async (senderId, receiverId, content) => {
  const query = 'INSERT INTO messages(sender_id, receiver_id, content) VALUES($1, $2, $3)';
  await client.query(query, [senderId, receiverId, content]);
};

module.exports = { createMessage };
