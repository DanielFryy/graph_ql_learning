const Post = {
  author: ({ author }, args, { db }, info) =>
    db.users.find(({ id }) => id === author),
  comments: ({ id }, args, { db }, info) =>
    db.comments.filter(({ post }) => post === id),
};

export default Post;
