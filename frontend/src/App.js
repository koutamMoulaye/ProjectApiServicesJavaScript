// Frontend React avec UI pro et formulaire bien centré + stylé
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [recoveryPhrase, setRecoveryPhrase] = useState("");
  const [connected, setConnected] = useState(false);
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [likesCount, setLikesCount] = useState({});

  const API = "http://localhost:3000";

  const register = async () => {
    await axios.post(`${API}/register`, { userName, password, recoveryPhrase });
    alert("Inscription réussie !");
  };

  const login = async () => {
    await axios.post(`${API}/login`, { userName, password });
    setConnected(true);
  };

  const createPost = async () => {
    await axios.post(`${API}/posts`, { userId: userName, content });
    setContent("");
    fetchPosts();
  };

  const fetchPosts = async () => {
    const res = await axios.get(`${API}/posts`);
    setPosts(res.data);
    fetchLikes(res.data);
  };

  const fetchLikes = async (posts) => {
    const counts = {};
    for (let post of posts) {
      try {
        const res = await axios.get(`${API}/likes/${post._id}`);
        counts[post._id] = res.data.count;
      } catch (err) {
        counts[post._id] = 0;
      }
    }
    setLikesCount(counts);
  };

  const likePost = async (postId) => {
    try {
      const res = await axios.get(`${API}/likes/${postId}`);
      const userLiked = res.data.likes.some((like) => like.userId === userName);

      if (userLiked) {
        await axios.delete(`${API}/likes`, {
          data: { userId: userName, postId }
        });
      } else {
        await axios.post(`${API}/likes`, { userId: userName, postId });
      }

      fetchPosts();
    } catch (err) {
      alert(err.response?.data || "Erreur lors du like/dislike");
      console.error(err);
    }
  };

  useEffect(() => {
    if (connected) fetchPosts();
    // eslint-disable-next-line
  }, [connected]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-10">🌐 Réseau Social</h1>

        {!connected ? (
          <div className="bg-white shadow-lg rounded-xl p-8 space-y-5">
            <input className="border w-full p-3 rounded focus:outline-blue-500" placeholder="Nom d'utilisateur" value={userName} onChange={(e) => setUserName(e.target.value)} />
            <input className="border w-full p-3 rounded focus:outline-blue-500" type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
            <input className="border w-full p-3 rounded focus:outline-blue-500" placeholder="Phrase de récupération" value={recoveryPhrase} onChange={(e) => setRecoveryPhrase(e.target.value)} />
            <div className="flex justify-between">
              <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700" onClick={register}>S'inscrire</button>
              <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700" onClick={login}>Se connecter</button>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">Créer un post</h2>
              <textarea className="w-full border rounded p-2 focus:outline-purple-400" rows={3} value={content} onChange={(e) => setContent(e.target.value)} />
              <button className="mt-3 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700" onClick={createPost}>Publier</button>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">📰 Tous les posts</h2>
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post._id} className="bg-white rounded-lg shadow p-4 flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center font-bold">
                        {post.userId[0].toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{post.userId}</div>
                      <p className="text-gray-700 mt-1">{post.content}</p>
                      <button
                        className="mt-2 inline-block text-sm text-red-600 hover:underline"
                        onClick={() => likePost(post._id)}
                      >
                        ❤️ Liker ({likesCount[post._id] || 0})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}