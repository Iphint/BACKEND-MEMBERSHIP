const { validateRole } = require('../middleware/AuthMiddleware');

const user = validateRole(['USER']);
const general = validateRole(['USER', 'ADMIN']);
const admin = validateRole(['ADMIN']);

module.exports = {
  user,
  general,
  admin,
};
