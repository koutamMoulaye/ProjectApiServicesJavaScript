const expressLikes = require('express');
const mongooseLikes = require('mongoose');
const dotenvLikes = require('dotenv');
const corsLikes = require('cors');

dotenvLikes.config();
const likeApp = expressLikes();
likeApp.use(expressLikes.json());
likeApp.use(corsLikes());

mongooseLikes.connect(process.env.MONGO_URI_LIKES)
  .then(() => console.log('✅ [likes-service] DB connected'))
  .catch(err => console.error(err));

const likeSchema = new mongooseLikes.Schema({
  userId: { type: String, required: true },
  postId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Like = mongooseLikes.model('Like', likeSchema);

// Like a post
likeApp.post('/likes', async (req, res) => {
  try {
    const { userId, postId } = req.body;
    const existing = await Like.findOne({ userId, postId });
    if (existing) return res.status(400).send('Post already liked');

    const like = new Like({ userId, postId });
    await like.save();
    res.status(201).json(like);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Unlike a post
likeApp.delete('/likes', async (req, res) => {
  try {
    const { userId, postId } = req.body;
    await Like.findOneAndDelete({ userId, postId });
    res.send('Like removed');
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all likes for a post
likeApp.get('/likes/:postId', async (req, res) => {
  const likes = await Like.find({ postId: req.params.postId });
  res.json({ count: likes.length, likes });
});

const PORT_LIKES = process.env.LIKES_PORT || 3003;
likeApp.listen(PORT_LIKES, () => console.log(`Likes Service running on port ${PORT_LIKES}`));