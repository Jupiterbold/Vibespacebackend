const { createUser } = require('../models/userModel');

const registerUser = async (req, res) => {
  const { name, email } = req.body;
  await createUser(name, email);
  res.send('User registered');
};

module.exports = { registerUser };
