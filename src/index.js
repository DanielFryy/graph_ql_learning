import { GraphQLServer } from 'graphql-yoga';

// Scalar types - String, Boolean, Int, Float, ID

// Demo user data
const users = [
  {
    id: '1',
    name: 'Peete',
    email: 'peete.zahut@gmail.com',
    age: 29,
  },
  {
    id: '2',
    name: 'Liss',
    email: 'liss.ang@gmail.com',
  },
  {
    id: '3',
    name: 'Mike',
    email: 'mike@gmail.com',
  },
];

// Demo post data
const posts = [
  {
    id: '1',
    title: 'hello',
    body: 'the gretting for the far world',
    published: true,
    author: '1',
  },
  {
    id: '2',
    title: 'far',
    body: 'the cualifier of the world',
    published: false,
    author: '1',
  },
  {
    id: '3',
    title: 'world',
    body: 'the far far world',
    published: true,
    author: '2',
  },
];

// Demo comment data
const comments = [
  {
    id: '1',
    text: 'this is a random text',
    author: '2',
    post: '1',
  },
  {
    id: '2',
    text: "don't speak",
    author: '2',
    post: '2',
  },
  {
    id: '3',
    text: 'hello darkness my old friend',
    author: '3',
    post: '3',
  },
  {
    id: '4',
    text: "I'm here to talk with u again ",
    author: '1',
    post: '1',
  },
];

// Type definitions (schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments: [Comment!]!
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    users: (parent, { query }, ctx, info) => {
      if (!query) return users;
      return users.filter(({ name }) =>
        name.toLowerCase().includes(query.toLowerCase())
      );
    },
    posts: (parent, { query }, ctx, info) => {
      if (!query) return posts;
      return posts.filter(
        ({ title, body }) =>
          title.toLowerCase().includes(query.toLowerCase()) ||
          body.toLowerCase().includes(query.toLowerCase())
      );
    },
    comments: (parent, args, ctx, info) => comments,
    me: () => ({
      id: '132',
      name: 'Peete',
      email: 'peete.zahut@gmail.com',
      age: 29,
    }),
    post: () => ({
      id: '164156',
      title: 'dafsdafsd',
      body: 'fasadfafsas',
      published: false,
    }),
  },
  Post: {
    author: ({ author }, args, ctx, info) =>
      users.find(({ id }) => id === author),
    comments: ({ id }, args, ctx, info) =>
      comments.filter(({ post }) => post === id),
  },
  User: {
    posts: ({ id }, args, ctx, info) =>
      posts.filter(({ author }) => author === id),
    comments: ({ id }, args, ctx, info) =>
      comments.filter(({ author }) => author === id),
  },
  Comment: {
    author: ({ author }, args, ctx, info) =>
      users.find(({ id }) => id === author),
    post: ({ post }, args, ctx, info) => posts.find(({ id }) => id === post),
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(({ port }) => {
  console.log('listening in:', `http://localhost:${port}`);
});
