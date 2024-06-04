

// const { GraphQLError } = require('graphql');
// const jwt = require('jsonwebtoken');

// // Set token secret and expiration date
// const secret = 'mysecretsshhhhh';
// const expiration = '2h';

// // Custom error class
// class AuthenticationError extends GraphQLError {
//   constructor(message) {
//     super(message || 'Could not authenticate user.', {
//       extensions: {
//         code: 'UNAUTHENTICATED',
//       },
//     });
//   }
// }

// const authMiddleware = ({ req }) => {
//   // Allows token to be sent via req.query or headers
//   let token = req.query.token || req.headers.authorization;

//   // Ensure token is present
//   if (req.headers.authorization) {
//     const [bearer, tokenValue] = req.headers.authorization.split(' ');
//     if (bearer === 'Bearer') {
//       token = tokenValue;
//     }
//   }

//   // Verify token and get user data out of it
//   if (token) {
//     try {
//       const { data } = jwt.verify(token, secret, { maxAge: expiration });
//       req.user = data;
//     } catch (error) {
//       console.log('Invalid or expired token:', error.message);
//     }
//   }

//   return req;
// };

// const signToken = ({ username, email, _id }) => {
//   const payload = { username, email, _id };
//   return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
// };

// module.exports = {
//   authMiddleware,
//   signToken,
// };

const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');

// Set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

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
  let token = req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    const [bearer, tokenValue] = req.headers.authorization.split(' ');
    if (bearer === 'Bearer') {
      token = tokenValue;
    }
  }

  if (token) {
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
      console.log('Authenticated user:', req.user);
    } catch (error) {
      console.log('Invalid or expired token:', error.message);
    }
  } else {
    console.log('No token provided');
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
