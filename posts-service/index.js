const expressPost = require('express');
const mongoosePost = require('mongoose');
const dotenvPost = require('dotenv');
const corsPost = require('cors');

dotenvPost.config();
const postApp = expressPost();
postApp.use(expressPost.json());
postApp.use(corsPost());

mongoosePost.connect(process.env.MONGO_URI_POSTS)
  .then(() => console.log('✅ [posts-service] DB connected'))
  .catch(err => console.error(err));

const postSchema = new mongoosePost.Schema({
  userId: { type: String, required: true },
  content: { type: String, required: true },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Post = mongoosePost.model('Post', postSchema);

// Create post
postApp.post('/posts', async (req, res) => {
  try {
    const { userId, content } = req.body;
    const post = new Post({ userId, content });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all posts
postApp.get('/posts', async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

// Update post
postApp.put('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete post
postApp.delete('/posts/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.send('Post deleted');
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT_POSTS = process.env.POSTS_PORT || 3002;
postApp.listen(PORT_POSTS, () => console.log(`🚀 Posts Service running on port ${PORT_POSTS}`));