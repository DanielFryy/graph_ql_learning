import { GraphQLServer } from 'graphql-yoga';

// Scalar types - String, Boolean, Int, Float, ID

// Type definitions (schema)
const typeDefs = `
  type Query {
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    me: () => ({
      id: '132',
      name: 'Peete',
      email: 'peete.zahut@gmail.com',
      age: 29,
    }),
    post: () => ({
      id: "164156",
      title: "dafsdafsd",
      body: "fasadfafsas",
      published: false
    })
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(options => {
  console.log('Up', options);
});
