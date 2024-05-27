const { User } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    // Fetch the authenticated user's data, including their saved books
    me: async (parent, { userId }) => {
      const user = await User.findOne({ _id: userId }).populate("savedBooks");
      if (!user) {
        throw new AuthenticationError("User not found");
      }
      return user;
    },
  },

  Mutation: {
    // Register a new user and return an authentication token
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },

    // Authenticate a user by email and password, then return an authentication token
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Invalid credentials");
      }

      const isPasswordCorrect = await user.isCorrectPassword(password);
      if (!isPasswordCorrect) {
        throw new AuthenticationError("Invalid credentials");
      }

      const token = signToken(user);
      return { token, user };
    },

    // Save a book to the user's savedBooks array
    saveBook: async (parent, bookDetails, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: bookDetails } },
          { new: true }
        ).populate("savedBooks");
        return updatedUser;
      }
      throw new AuthenticationError("You need to be logged in");
    },

    // Remove a book from the user's savedBooks array
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        ).populate("savedBooks");
        return updatedUser;
      }
      throw new AuthenticationError("You need to be logged in");
    },
  },
};

module.exports = resolvers;
