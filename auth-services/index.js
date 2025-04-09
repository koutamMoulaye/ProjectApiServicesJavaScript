const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI_AUTH)
  .then(() => console.log('✅ [auth-service] DB connected'))
  .catch(err => console.error(err));

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  recoveryPhrase: { type: String, required: true }
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const User = mongoose.model('User', userSchema);

app.post('/register', async (req, res) => {
  try {
    const { userName, password, recoveryPhrase } = req.body;
    const user = new User({ userName, password, recoveryPhrase });
    await user.save();
    res.status(201).send('User created');
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });
    if (!user) return res.status(400).send('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send('Wrong password');

    res.status(200).send('Login success');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/recover', async (req, res) => {
  try {
    const { userName, recoveryPhrase, newPassword } = req.body;
    const user = await User.findOne({ userName });
    if (!user) return res.status(404).send('User not found');
    if (user.recoveryPhrase !== recoveryPhrase) return res.status(403).send('Invalid recovery phrase');

    user.password = newPassword;
    await user.save();
    res.send('Password updated');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Auth Service running on port ${PORT}`));