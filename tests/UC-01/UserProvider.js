const users = require('./users.json');

const getNewUser = () => {
  return users.userNew;
};

const getExistingUser = () => {
  return users.existingUser;
};

module.exports = { getNewUser, getExistingUser };
