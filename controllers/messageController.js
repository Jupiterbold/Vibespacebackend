const { createMessage } = require('../models/messageModel');

const sendMessage = async (req, res) => {
  const { senderId, receiverId, content } = req.body;
  await createMessage(senderId, receiverId, content);
  res.send('Message sent');
};

module.exports = { sendMessage };
