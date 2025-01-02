import React, { useEffect, useState } from 'react';

const Home = () => {
  const [posts, setPosts] = useState([]); // Store posts
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/viewallposts');
        if (response.ok) {
          const data = await response.json();
          console.log("data",data);
          
          setPosts(data.message);
        } else {
          console.log('Error fetching posts:', response.statusText);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array to fetch only once on mount

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow p-4 fixed w-full top-0 z-10">
        <h1 className="text-center text-2xl font-bold">Instagram</h1>
      </div>

      {/* Posts Feed */}
      <div className="mt-20 px-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading posts...</p>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-lg shadow mb-6 overflow-hidden"
            >
              {/* Post Header */}
              <div className="flex items-center p-4 border-b">
                <div className="bg-blue-500 h-10 w-10 rounded-full"></div>
                <div className="ml-4">
                  <h3 className="text-sm font-bold">User Name</h3>
                  <p className="text-xs text-gray-500">
                    {new Date(post.postedDate).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Post Media */}
              {post.files && post.files.endsWith('.mp4') && (
                <video
                  controls
                  className="w-full h-auto object-cover"
                >
                  <source src={`/api/${post.files}`} type="video/mp4" />
                  Your browser does not support the video element.
                </video>
              )}

              {post.music && (
                <audio controls className="w-full px-4 py-2">
                  <source src={`/api/${post.music}`} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
              )}

              {/* Post Description */}
              <div className="p-4">
                <p className="text-sm text-gray-800">{post.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No posts available</p>
        )}
      </div>
    </div>
  );
};

export default Home;
