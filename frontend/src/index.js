import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink, split } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { BrowserRouter as Router } from 'react-router-dom'

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('library-user-token')
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : null
        }
    }
})

const httpLink = createHttpLink({
    uri: 'https://booknest-lsjz.onrender.com',
})

const wsLink = new GraphQLWsLink(  createClient({ 
    url: 'https://booknest-lsjz.onrender.com' 
}))

const splitLink = split(
      ({ query }) => {
        const definition = getMainDefinition(query)
        return (      
            definition.kind === 'OperationDefinition' &&      
            definition.operation === 'subscription'    
            )  
        },  
        wsLink,  
        authLink.concat(httpLink))

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: splitLink
})

ReactDOM.createRoot(document.getElementById('root')).render(
    <Router>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </Router>
    
)