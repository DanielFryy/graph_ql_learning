const Query = {
  users: (parent, { query }, { db }, info) => {
    if (!query) return db.users;
    return db.users.filter(({ name }) =>
      name.toLowerCase().includes(query.toLowerCase())
    );
  },
  posts: (parent, { query }, { db }, info) => {
    if (!query) return db.posts;
    return db.posts.filter(
      ({ title, body }) =>
        title.toLowerCase().includes(query.toLowerCase()) ||
        body.toLowerCase().includes(query.toLowerCase())
    );
  },
  comments: (parent, args, { db }, info) => db.comments,
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
};

export default Query;
