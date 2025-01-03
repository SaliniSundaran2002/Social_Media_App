import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const [user, setUser] = useState(null); // Store user details
  const [posts, setPosts] = useState([]); // Store user posts
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await fetch('/api/getUserdetails'); 
        const postsResponse = await fetch('/api/getPostdetails');
        
        if (userResponse.ok && postsResponse.ok) {
          const userData = await userResponse.json();
          const userPosts = await postsResponse.json();

          setUser(userData);
          setPosts(userPosts);
        } else {
          console.error('Error fetching data');
          toast.error('Error fetching user or posts data');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleDelete = async (postId) => {
    try {
      const response = await fetch(`/api/deletePost/${postId}`, { method: 'DELETE' });

      if (response.ok) {
        setPosts(posts.filter((post) => post._id !== postId));
        toast.success('Post deleted successfully');
      } else {
        console.error('Error deleting post:', response.statusText);
        toast.error('Failed to delete the post');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('An error occurred while deleting the post');
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="flex flex-col  bg-white shadow-md p-6">
        {user?.userDetails.profilePic ? (
          <img 
            src={`/api/${user.userDetails.profilePic}`}
            alt="Profile" 
            className="h-32 w-32 rounded-full mx-auto"
          />
        ) : (
          <div className="h-32 w-32 bg-gray-300 rounded-full mx-auto"></div>
        )}
        <h1 className="text-center font-bold text-lg mt-4">{user?.username}</h1>
        <h4 className="text-center font-bold mt-4">{user.userDetails.bio}</h4>
        <h4 className="text-center font-bold mt-4">{user.userDetails.gender}</h4>
        <Link
          to="/editProfile"
          className="block bg-blue-500 text-white text-center rounded-lg mt-4 py-2"
        >
          Edit Profile
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-6">Your Posts</h2>
        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post._id}
                className="flex items-center bg-white shadow rounded-lg p-4"
              >
                {/* Post Media */}
                {post.files && post.files.endsWith('.mp4') ? (
                  <video
                    src={`/api/${post.files}`}
                    controls
                    className="w-1/3 rounded-lg"
                  />
                ) : (
                  <img
                    src={`/api/${post.files}`}
                    alt="Post"
                    className="w-1/3 rounded-lg"
                  />
                )}

                {/* Post Details */}
                <div className="flex-1 ml-4">
                  <p className="text-sm text-gray-800">{post.description}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(post.postedDate).toLocaleString()}
                  </p>
                </div>

                {/* Delete Link */}
                <button
                  onClick={() => handleDelete(post._id)}
                  className="text-red-500 hover:text-red-700 font-bold"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You haven't uploaded any posts yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
