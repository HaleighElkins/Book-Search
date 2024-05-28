// const { GraphQLError } = require('graphql');
// const jwt = require('jsonwebtoken');

// // set token secret and expiration date
// const secret = 'mysecretsshhhhh';
// const expiration = '2h';

// // Custom error class
// class AutenticationError extends GraphQLError {
//   constructor() {
//     super('Could not authenticate user.', {
//       extensions: {
//         code: 'UNAUTHENTICATED',
//       },
//     });
//   }
// }


// module.exports = {
//   // function for our authenticated routes
//   authMiddleware: function (req, res, next) {
//     // allows token to be sent via  req.query or headers
//     let token = req.query.token || req.headers.authorization;

//     // ["Bearer", "<tokenvalue>"]
//     if (req.headers.authorization) {
//       token = token.split(' ').pop().trim();
//     }

//     if (!token) {
//       return res.status(400).json({ message: 'You have no token!' });
//     }

//     // verify token and get user data out of it
//     try {
//       const { data } = jwt.verify(token, secret, { maxAge: expiration });
//       req.user = data;
//     } catch {
//       console.log('Invalid token');
//       return res.status(400).json({ message: 'invalid token!' });
//     }

//     // send to next endpoint
//     next();
//   },
//   signToken: function ({ username, email, _id }) {
//     const payload = { username, email, _id };

//     return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
//   },
// };


const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

// Custom error class
class AuthenticationError extends GraphQLError {
  constructor(message) {
    super(message || 'Could not authenticate user.', {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    });
  }
}

module.exports = {
  // function for our authenticated routes
  authMiddleware: function (req, res, next) {
    // allows token to be sent via req.query or headers
    let token = req.query.token || req.headers.authorization;

    // Ensure token is present
    if (!token) {
      throw new AuthenticationError('Authentication token is missing.');
    }

    // Extract token from authorization header if present
    if (req.headers.authorization) {
      const [bearer, tokenValue] = req.headers.authorization.split(' ');
      if (bearer !== 'Bearer' || !tokenValue) {
        throw new AuthenticationError('Invalid authorization header format.');
      }
      token = tokenValue;
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
      next();
    } catch (error) {
      throw new AuthenticationError('Invalid or expired token.');
    }
  },

  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
