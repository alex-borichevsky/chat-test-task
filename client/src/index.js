import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom'
import { setContext } from '@apollo/client/link/context';
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: localStorage.getItem('jwt')|| "" ,
    }
  }
});

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
});

const wsLink = new GraphQLWsLink(createClient({
  url: 'wss://localhost:4000/graphql',
}));

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink),
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
    <ApolloProvider client={client}>
       <App />
    </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
