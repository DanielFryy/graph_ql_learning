const Comment = {
  author: ({ author }, args, { db }, info) =>
    db.users.find(({ id }) => id === author),
  post: ({ post }, args, { db }, info) =>
    db.posts.find(({ id }) => id === post),
};

export default Comment;
