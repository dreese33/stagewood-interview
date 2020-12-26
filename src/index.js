//This code was copied from the GraphQL tutorial
import { ApolloServer } from 'apollo-server';

import pkg from '@prisma/client';
const { PrismaClient } = pkg;

import fs from 'fs';
import path from 'path';


const prisma = new PrismaClient();
const resolvers = {
    Query: {
        getUser: async (parent, args, context) => {
            const { username } = args;
            return context.prisma.accounts.findUnique({
                where: {
                    username,
                }
            });
        },
        userExists: async (parent, args, context) => {
            const { username } = args;
            return context.prisma.accounts.findUnique({
                where: {
                    username,
                }
            });
        },
        emailExists: async (parent, args, context) => {
            const { email } = args;
            return context.prisma.accounts.findUnique({
                where: {
                    email,
                }
            });
        }
    },
    Mutation: {
        createUser: async (parent, args, context, info) => {
            const { username, email, name, password } = args; 
            const newUser = context.prisma.accounts.create({
                data: {
                    username: username,
                    email: email,
                    name: name,
                    password: password
                }
            });
            return newUser;
        }
    }
};

const __dirname = path.resolve(path.dirname(''));
const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'src/schema.graphql'),
        'utf-8'
    ),
    resolvers,
    context: {
        prisma,
    }
});

server.listen().then(({ url }) =>
    console.log(`Server is running on ${url}`)
);
