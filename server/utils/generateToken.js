const jwt = require('jsonwebtoken');

/**
 * Generate a JSON Web Token for authenticated users
 * @param {string} id - The user ID
 * @returns {string} - Signed JWT
 */
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'dev_jwt_secret_fallback_key';
  return jwt.sign({ id }, secret, {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
