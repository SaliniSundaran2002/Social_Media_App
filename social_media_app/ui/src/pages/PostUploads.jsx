import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PostUploads = () => {
  const [file, setFiles] = useState({
    files: null, // to store the image/video file
    music: null, // to store the audio file
  });
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if both files are selected
    if (!file.files || !file.music) {
      toast.error('Both image/video and audio files are required!');
      return;
    }

    const formData = new FormData();
    console.log("Files before appending:", file); 
    formData.append('files', file.files);
    formData.append('music', file.music);
    formData.append('description', description);

    try {
      const response = await fetch('/api/uploadPost', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log(response.status);
      

      if (response.status === 200) {
        console.log("Response data:", data);
        toast.success('Post created successfully!');
        navigate('/home');
      } else {
        toast.error(data.message || 'Failed to create post');
      }
    } catch (error) {
      console.error("Error:", error.message);
      toast.error('An error occurred while creating the post.');
    }
  };

  const handleChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles((prevData) => ({
      ...prevData,
      [name]: selectedFiles[0],
    }));
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value); 
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md border border-gray-300 rounded-lg shadow-lg p-8 bg-white mt-24">
        <h2 className="text-2xl font-semibold mb-6 text-center bg-gradient-to-r from-blue-500 to-pink-600 bg-clip-text text-transparent">
          Create a new post
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Image/Video Upload */}
          <div className="mb-4">
            <label htmlFor="imageOrVideo">Image/Video:</label>
            <input
              type="file"
              id="imageOrVideo"
              name="files"
              onChange={handleChange}
              className="w-full border border-blue-500 p-4 rounded-lg"
              accept="image/*,video/*"  // Restrict file types
            />
          </div>

          {/* Audio Upload */}
          <div className="mb-4">
            <label htmlFor="audio">Audio:</label>
            <input
              type="file"
              id="audio"
              name="music"
              onChange={handleChange}
              className="w-full border border-blue-500 p-4 rounded-lg"
              accept="audio/*"  // Restrict audio file types
            />
          </div>

          {/* Description Box */}
          <div className="mb-4">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={handleDescriptionChange}
              rows="4"
              className="w-full border border-blue-500 p-4 rounded-lg"
              placeholder="Enter your description"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center items-center mb-4">
            <button
              type="submit"
              className="text-center w-full bg-gradient-to-r from-blue-500 to-pink-600 text-white p-3 rounded-lg border border-blue-500 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/50 transition duration-300"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostUploads;
