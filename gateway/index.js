const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Routes utilisateurs
app.post('/register', async (req, res) => {
  try {
    const response = await axios.post(`${process.env.AUTH}/register`, req.body);
    res.status(response.status).send(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).send(err.response?.data || 'Erreur serveur');
  }
});

app.post('/login', async (req, res) => {
  try {
    const response = await axios.post(`${process.env.AUTH}/login`, req.body);
    res.status(response.status).send(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).send(err.response?.data || 'Erreur serveur');
  }
});

app.post('/recover', async (req, res) => {
  try {
    const response = await axios.post(`${process.env.AUTH}/recover`, req.body);
    res.status(response.status).send(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).send(err.response?.data || 'Erreur serveur');
  }
});

// Routes posts
app.post('/posts', async (req, res) => {
  try {
    const response = await axios.post(`${process.env.POSTS}/posts`, req.body);
    res.status(response.status).send(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).send(err.response?.data || 'Erreur serveur');
  }
});

app.get('/posts', async (req, res) => {
  try {
    const response = await axios.get(`${process.env.POSTS}/posts`);
    res.status(response.status).send(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).send(err.response?.data || 'Erreur serveur');
  }
});

// Routes likes
app.post('/likes', async (req, res) => {
  try {
    const response = await axios.post(`${process.env.LIKES}/likes`, req.body);
    res.status(response.status).send(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).send(err.response?.data || 'Erreur serveur');
  }
});

app.delete('/likes', async (req, res) => {
  try {
    const response = await axios.delete(`${process.env.LIKES}/likes`, { data: req.body });
    res.status(response.status).send(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).send(err.response?.data || 'Erreur serveur');
  }
});

app.get('/likes/:postId', async (req, res) => {
  try {
    const response = await axios.get(`${process.env.LIKES}/likes/${req.params.postId}`);
    res.status(response.status).send(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).send(err.response?.data || 'Erreur serveur');
  }
});

const GATEWAY_PORT = process.env.GATEWAY_PORT || 3000;
app.listen(GATEWAY_PORT, () => console.log(`🚀 Gateway running on port ${GATEWAY_PORT}`));