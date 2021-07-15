const Subscription = {
  count: {
    subscribe: (parent, args, ctx, info) => {
      const { pubsub } = ctx;
      let count = 0;
      setInterval(() => {
        count++;
        pubsub.publish('count', { count });
      }, 1000);
      return pubsub.asyncIterator('count');
    },
  },
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
};

export default Subscription;
