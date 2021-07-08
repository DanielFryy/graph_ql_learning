// Demo user data
const users = [
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
const posts = [
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
const comments = [
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

const db = { users, posts, comments };

export default db;
