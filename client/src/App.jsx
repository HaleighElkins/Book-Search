// import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
// import { setContext } from '@apollo/client/link/context';
// import { Outlet } from 'react-router-dom';
// import Navbar from './components/Navbar';


// // GraphQL 
// const httpLink = createHttpLink({ 
//   uri: '/graphql',
// });

// // Middleware 
// const authLink = setContext((_, { headers }) => {
//   const token = localStorage.getItem('id_token');
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : '',
//     },
//   };
// });

// // Apollo Client
// const client = new ApolloClient({
//   link: authLink.concat(httpLink),
//   cache: new InMemoryCache(),
// });

// const App = () => {
//   return ( 
//     <ApolloProvider client={client}>
//       <Navbar />
//       <Outlet />
//     </ApolloProvider>
//   );
// };

// export default App;


import './App.css';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

// Create a link to the GraphQL API endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Middleware to attach the JWT token to the authorization header
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Set up Apollo Client with middleware and cache
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;
