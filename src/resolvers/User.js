const User = {
  posts: ({ id }, args, { db }, info) =>
    db.posts.filter(({ author }) => author === id),
  comments: ({ id }, args, { db }, info) =>
    db.comments.filter(({ author }) => author === id),
};

export default User;
