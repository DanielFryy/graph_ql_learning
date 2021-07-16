const Subscription = {
  comment: {
    subscribe: (parent, args, ctx, info) => {
      const { postId } = args;
      const { pubsub, db } = ctx;
      const post = db.posts.find(
        ({ id, published }) => id === postId && published
      );
      if (!post) throw new Error('Post not found');
      return pubsub.asyncIterator(`comment ${postId}`);
    },
  },
  post: {
    subscribe: (parent, args, ctx, info) => {
      const { pubsub } = ctx;
      return pubsub.asyncIterator('post');
    },
  },
};

export default Subscription;
