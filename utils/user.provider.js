const users = require('./users.json');

const getNewUser = () => {
  return users.userNew;
};

const getExistingUser = () => {
  return users.existingUser;
};

const getRegistrationUser = () => {
  return users.registrationUser;
}

module.exports = { getNewUser, getExistingUser, getRegistrationUser };
