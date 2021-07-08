import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';

// Scalar types - String, Boolean, Int, Float, ID

// Demo user data
let users = [
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
let posts = [
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
let comments = [
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

  type Mutation {
    createUser(data: CreateUserInput!): User!
    deleteUser(id: ID!): User!
    createPost(data: CreatePostInput!): Post!
    deletePost(id: ID!): Post!
    createComment(data: CreateCommentInput!): Comment!
    deleteComment(id: ID!): Comment!
  }

  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }

  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }

  input CreateCommentInput {
    text: String!
    author: ID!
    post: ID!
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
  Mutation: {
    createUser: (parent, { data }, ctx, info) => {
      const emailTaken = users.some(({ email }) => email === data.email);
      if (emailTaken) throw new Error('Email taken');
      const user = {
        id: uuidv4(),
        ...data,
      };
      users.push(user);
      return user;
    },
    deleteUser: (parent, args, ctx, info) => {
      const userIndex = users.findIndex(({ id }) => id === args.id);
      if (userIndex < 0) throw new Error('User not found');
      const [deletedUser] = users.splice(userIndex, 1);
      posts = posts.filter(({ author, id }) => {
        const match = author === args.id;
        if (match) {
          comments = comments.filter(({ post }) => post !== id);
        }
        return !match;
      });
      comments = comments.filter(({ author }) => author !== args.id);
      return deletedUser;
    },
    createPost: (parent, { data }, ctx, info) => {
      const usersExists = users.some(({ id }) => id === data.author);
      if (!usersExists) throw new Error('User not found');
      const post = {
        id: uuidv4(),
        ...data,
      };
      posts.push(post);
      return post;
    },
    deletePost: (parent, args, ctx, info) => {
      const postIndex = posts.findIndex(({ id }) => id === args.id);
      if (postIndex < 0) throw new Error('Post not found');
      const [deletedPost] = posts.splice(postIndex, 1);
      comments = comments.filter(({ post }) => post !== args.id);
      return deletedPost;
    },
    createComment: (parent, { data }, ctx, info) => {
      const usersExists = users.some(({ id }) => id === data.author);
      if (!usersExists) throw new Error('User not found');
      const isAPublishedPost = posts.some(
        ({ id, published }) => id === data.post && published
      );
      if (!isAPublishedPost) throw new Error('Published post not found');
      const comment = {
        id: uuidv4(),
        ...data,
      };
      comments.push(comment);
      return comment;
    },
    deleteComment: (parent, args, ctx, info) => {
      const commentIndex = comments.findIndex(({ id }) => id === args.id);
      if (commentIndex < 0) throw new Error('Comment not found');
      const [deletedComment] = comments.splice(commentIndex, 1);
      return deletedComment;
    },
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
  console.log(`Server is running on http://localhost:${port}`);
});
