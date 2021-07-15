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
  updateUser: (parent, { id, data }, { db }, info) => {
    const user = db.users.find(user => user.id === id);
    if (!user) throw new Error('User not found');
    if (typeof data.email === 'string') {
      const emailTaken = db.users.some(({ email }) => email === data.email);
      if (emailTaken) throw new Error('Emai taken');
      user.email = data.email;
    }
    if (typeof data.name === 'string') {
      user.name = data.name;
    }
    if (typeof data.age !== 'undefined') {
      user.age = data.age;
    }
    return user;
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
  updatePost: (parent, { id, data }, { db }, info) => {
    const post = db.posts.find(post => post.id === id);
    if (!post) throw new Error('Post not found');
    if (typeof data.title === 'string') {
      post.title = data.title;
    }
    if (typeof data.body === 'string') {
      post.body = data.body;
    }
    if (typeof data.published === 'boolean') {
      post.published = data.published;
    }
    return post;
  },
  createComment: (parent, { data }, ctx, info) => {
    const { db, pubsub } = ctx;
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
    pubsub.publish(`comment ${data.post}`, { comment });
    return comment;
  },
  deleteComment: (parent, args, { db }, info) => {
    const commentIndex = db.comments.findIndex(({ id }) => id === args.id);
    if (commentIndex < 0) throw new Error('Comment not found');
    const [deletedComment] = db.comments.splice(commentIndex, 1);
    return deletedComment;
  },
  updateComment: (parent, { id, data }, { db }, info) => {
    const comment = db.comments.find(comment => comment.id === id);
    if (!comment) throw new Error('Comment not found');
    if (typeof data.text === 'string') {
      comment.text = data.text;
    }
    return comment;
  },
};

export default Mutation;
