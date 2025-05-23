import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface Post {
  id: number;
  title: string;
  content: string;
  image: string | null;
  created_at: string;
  author: string;
}

function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    axios.get("http://localhost:3001/api/articles").then((res) => setPosts(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-12 px-4">
    <div className="p-4 grid grid-cols-1 gap-4 ">
      {posts.map((post) => (
        <Link
          to={`/api/articles/${post.id}`}
          key={post.id}
          className="border rounded shadow p-2"
        >
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="h-24 w-full object-cover rounded"
            />
          )}
          <h2 className="text-lg text-center font-semibold mt-2">{post.title}</h2>
          <p className="text-sm text-end text-gray-500">
            Por {post.author} • {new Date(post.created_at).toLocaleDateString()}
          </p>
        </Link>
      ))}
    </div>
    </div>
    </div>
  );
}

export default Home;


