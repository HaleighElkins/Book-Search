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

// Set token secret and expiration date
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

const authMiddleware = ({ req }) => {
  // Allows token to be sent via req.query or headers
  let token = req.query.token || req.headers.authorization;

  // Ensure token is present
  if (req.headers.authorization) {
    const [bearer, tokenValue] = req.headers.authorization.split(' ');
    if (bearer === 'Bearer') {
      token = tokenValue;
    }
  }

  // Verify token and get user data out of it
  if (token) {
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch (error) {
      console.log('Invalid or expired token:', error.message);
    }
  }

  return req;
};

const signToken = ({ username, email, _id }) => {
  const payload = { username, email, _id };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
};

module.exports = {
  authMiddleware,
  signToken,
};
