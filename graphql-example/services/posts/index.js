const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

const posts = [
  { id: '1', title: 'First Post', content: 'This is my first post', authorId: '1', createdAt: '2024-01-01' },
  { id: '2', title: 'GraphQL is Great', content: 'Learning GraphQL with microservices', authorId: '2', createdAt: '2024-01-02' },
  { id: '3', title: 'Microservices Architecture', content: 'Building scalable applications', authorId: '1', createdAt: '2024-01-03' },
  { id: '4', title: 'Modern Development', content: 'Using modern tools and practices', authorId: '3', createdAt: '2024-01-04' }
];

app.get('/posts', (req, res) => {
  const { authorId } = req.query;
  let filteredPosts = posts;

  if (authorId) {
    filteredPosts = posts.filter(p => p.authorId === authorId);
  }

  res.json(filteredPosts);
});

app.get('/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  res.json(post);
});

app.post('/posts', (req, res) => {
  const { title, content, authorId } = req.body;
  const newPost = {
    id: String(posts.length + 1),
    title,
    content,
    authorId,
    createdAt: new Date().toISOString().split('T')[0]
  };
  posts.push(newPost);
  res.status(201).json(newPost);
});

app.listen(PORT, () => {
  console.log(`Posts service running on port ${PORT}`);
});