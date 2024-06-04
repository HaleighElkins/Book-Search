// const { AuthenticationError } = require('apollo-server-express');
// const { User } = require('../models');
// const { signToken } = require('../utils/auth');

// const resolvers = {
//   Query: {
//     me: async (parent, args, context) => {
//       if (context.user) {
//         return User.findById(context.user._id);
//       }
//       throw new AuthenticationError('Not logged in');
//     },
//   },
//   Mutation: {
//     addUser: async (parent, { username, email, password }) => {
//       const user = await User.create({ username, email, password });
//       const token = signToken(user);
//       return { token, user };
//     },
//     login: async (parent, { email, password }) => {
//       const user = await User.findOne({ email });
//       if (!user) {
//         throw new AuthenticationError('Incorrect credentials');
//       }
//       const correctPw = await user.isCorrectPassword(password);
//       if (!correctPw) {
//         throw new AuthenticationError('Incorrect credentials');
//       }
//       const token = signToken(user);
//       return { token, user };
//     },
//     saveBook: async (parent, args, context) => {
//       if (context.user) {
//         const updatedUser = await User.findByIdAndUpdate(
//           context.user._id,
//           { $addToSet: { savedBooks: args } },
//           { new: true }
//         );
//         return updatedUser;
//       }
//       throw new AuthenticationError('You need to be logged in!');
//     },
//     removeBook: async (parent, { bookId }, context) => {
//       if (context.user) {
//         const updatedUser = await User.findByIdAndUpdate(
//           context.user._id,
//           { $pull: { savedBooks: { bookId } } },
//           { new: true }
//         );
//         return updatedUser;
//       }
//       throw new AuthenticationError('You need to be logged in!');
//     },
//   },
// };

// module.exports = resolvers;


const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findById(context.user._id);
      }
      throw new AuthenticationError('Not logged in');
    },
  },
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      try {
        const user = await User.create({ username, email, password });
        const token = signToken(user);
        return { token, user };
      } catch (error) {
        console.error('Error adding user:', error);
        throw new Error('Error adding user');
      }
    },
    login: async (parent, { email, password }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new AuthenticationError('Incorrect credentials');
        }
        const correctPw = await user.isCorrectPassword(password);
        if (!correctPw) {
          throw new AuthenticationError('Incorrect credentials');
        }
        const token = signToken(user);
        return { token, user };
      } catch (error) {
        console.error('Error logging in:', error);
        throw new Error('Error logging in');
      }
    },
    saveBook: async (parent, args, context) => {
      if (context.user) {
        try {
          console.log('Saving book for user:', context.user);
          const updatedUser = await User.findByIdAndUpdate(
            context.user._id,
            { $addToSet: { savedBooks: args } },
            { new: true }
          );
          console.log('Book saved successfully:', updatedUser);
          return updatedUser;
        } catch (error) {
          console.error('Error saving book:', error);
          throw new Error('Error saving book');
        }
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        try {
          const updatedUser = await User.findByIdAndUpdate(
            context.user._id,
            { $pull: { savedBooks: { bookId } } },
            { new: true }
          );
          return updatedUser;
        } catch (error) {
          console.error('Error removing book:', error);
          throw new Error('Error removing book');
        }
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;
