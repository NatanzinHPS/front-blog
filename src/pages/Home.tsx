import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Post {
  id: number;
  title: string;
  image: string;
  created_at: string;
  author: {
    name: string;
  };
}

function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    axios.get('http://localhost:3000/articles').then((res) => setPosts(res.data));
  }, []);

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {posts.map((post) => (
        <Link to={`/posts/${post.id}`} key={post.id} className="border rounded shadow p-2">
          <img src={post.image} alt={post.title} className="h-48 w-full object-cover rounded" />
          <h2 className="text-lg font-semibold mt-2">{post.title}</h2>
          <p className="text-sm text-gray-500">Por {post.author.name} • {new Date(post.created_at).toLocaleDateString()}</p>
        </Link>
      ))}
    </div>
  );
}

export default Home;