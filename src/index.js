//This code was copied from the GraphQL tutorial
import { ApolloServer } from 'apollo-server';

const typeDefs = `
    type Query {
        info: String!
    }
`

const resolvers = {
    Query: {
        info: () => ` you`
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

server.listen().then(({ url }) =>
    console.log(`Server is running on ${url}`)
);
