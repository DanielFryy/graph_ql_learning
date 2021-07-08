import { v4 as uuidv4 } from 'uuid';

const Mutation = {
  createUser: (parent, { data }, { db }, info) => {
    const emailTaken = db.users.some(({ email }) => email === data.email);
    if (emailTaken) throw new Error('Email taken');
    const user = {
      id: uuidv4(),
      ...data,
    };
    db.users.push(user);
    return user;
  },
  deleteUser: (parent, args, { db }, info) => {
    const userIndex = db.users.findIndex(({ id }) => id === args.id);
    if (userIndex < 0) throw new Error('User not found');
    const [deletedUser] = db.users.splice(userIndex, 1);
    db.posts = db.posts.filter(({ author, id }) => {
      const match = author === args.id;
      if (match) {
        db.comments = db.comments.filter(({ post }) => post !== id);
      }
      return !match;
    });
    db.comments = db.comments.filter(({ author }) => author !== args.id);
    return deletedUser;
  },
  createPost: (parent, { data }, { db }, info) => {
    const usersExists = db.users.some(({ id }) => id === data.author);
    if (!usersExists) throw new Error('User not found');
    const post = {
      id: uuidv4(),
      ...data,
    };
    db.posts.push(post);
    return post;
  },
  deletePost: (parent, args, { db }, info) => {
    const postIndex = db.posts.findIndex(({ id }) => id === args.id);
    if (postIndex < 0) throw new Error('Post not found');
    const [deletedPost] = db.posts.splice(postIndex, 1);
    db.comments = db.comments.filter(({ post }) => post !== args.id);
    return deletedPost;
  },
  createComment: (parent, { data }, { db }, info) => {
    const usersExists = db.users.some(({ id }) => id === data.author);
    if (!usersExists) throw new Error('User not found');
    const isAPublishedPost = db.posts.some(
      ({ id, published }) => id === data.post && published
    );
    if (!isAPublishedPost) throw new Error('Published post not found');
    const comment = {
      id: uuidv4(),
      ...data,
    };
    db.comments.push(comment);
    return comment;
  },
  deleteComment: (parent, args, { db }, info) => {
    const commentIndex = db.comments.findIndex(({ id }) => id === args.id);
    if (commentIndex < 0) throw new Error('Comment not found');
    const [deletedComment] = db.comments.splice(commentIndex, 1);
    return deletedComment;
  },
};

export default Mutation;
