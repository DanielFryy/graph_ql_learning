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
  createPost: (parent, { data }, ctx, info) => {
    const { db, pubsub } = ctx;
    const usersExists = db.users.some(({ id }) => id === data.author);
    if (!usersExists) throw new Error('User not found');
    const post = {
      id: uuidv4(),
      ...data,
    };
    db.posts.push(post);
    if (post.published) {
      pubsub.publish('post', { post: { mutation: 'CREATED', data: post } });
    }
    return post;
  },
  deletePost: (parent, args, ctx, info) => {
    const { db, pubsub } = ctx;
    const postIndex = db.posts.findIndex(({ id }) => id === args.id);
    if (postIndex < 0) throw new Error('Post not found');
    const [post] = db.posts.splice(postIndex, 1);
    db.comments = db.comments.filter(({ post }) => post !== args.id);
    if (post.published) {
      pubsub.publish('post', { post: { mutation: 'DELETED', data: post } });
    }
    return post;
  },
  updatePost: (parent, { id, data }, ctx, info) => {
    const { db, pubsub } = ctx;
    const post = db.posts.find(post => post.id === id);
    const orginalPost = { ...post };
    if (!post) throw new Error('Post not found');
    if (typeof data.title === 'string') {
      post.title = data.title;
    }
    if (typeof data.body === 'string') {
      post.body = data.body;
    }
    if (typeof data.published === 'boolean') {
      post.published = data.published;
      if (orginalPost.published && !post.published) {
        pubsub.publish('post', {
          post: { mutation: 'DELETED', data: orginalPost },
        });
      } else if (!orginalPost.published && post.published) {
        pubsub.publish('post', { post: { mutation: 'CREATED', data: post } });
      }
    } else if (post.published) {
      pubsub.publish('post', { post: { mutation: 'UPDATED', data: post } });
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
    pubsub.publish(`comment ${data.post}`, {
      comment: { mutation: 'CREATED', data: comment },
    });
    return comment;
  },
  deleteComment: (parent, args, ctx, info) => {
    const { db, pubsub } = ctx;
    const commentIndex = db.comments.findIndex(({ id }) => id === args.id);
    if (commentIndex < 0) throw new Error('Comment not found');
    const [comment] = db.comments.splice(commentIndex, 1);
    pubsub.publish(`comment ${comment.post}`, {
      comment: { mutation: 'DELETED', data: comment },
    });
    return comment;
  },
  updateComment: (parent, { id, data }, ctx, info) => {
    const { db, pubsub } = ctx;
    const comment = db.comments.find(comment => comment.id === id);
    if (!comment) throw new Error('Comment not found');
    if (typeof data.text === 'string') {
      comment.text = data.text;
    }
    pubsub.publish(`comment ${comment.post}`, {
      comment: { mutation: 'UPDATED', data: comment },
    });
    return comment;
  },
};

export default Mutation;
