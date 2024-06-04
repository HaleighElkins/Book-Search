const express = require('express');
const path = require('path');
const db = require('./config/connection');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 4001;

const startApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // Apply authMiddleware to attach user to the request
      const contextReq = authMiddleware({ req });
      return { user: contextReq.user };
    },
  });

  await server.start();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Apply Apollo Server middleware
  app.use('/graphql', expressMiddleware(server));

  // Serve static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  } else {
    // In development, serve a simple message for the root route
    app.get('/', (req, res) => {
      res.send('Development mode: Use the React dev server at http://localhost:3000');
    });
  }

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

startApolloServer();