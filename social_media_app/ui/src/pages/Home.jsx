import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [posts, setPosts] = useState([]); 
  const [username, setUsername]= useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const videoRefs = useRef([]); // Refs to handle multiple video elements
  const audioRefs = useRef([]); // Refs to handle multiple audio elements
  const [playingAudio, setPlayingAudio] = useState(null); // Track the currently playing audio
  const [playingVideo, setPlayingVideo] = useState(null); // Track the currently playing video

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/viewallposts');
        if (response.ok) {
          const data = await response.json();
          console.log("data", data);
          setPosts(data.message);
        } else {
          console.log('Error fetching posts:', response.statusText);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } 
      
      try{
        const response = await fetch('/api/getUsername', {
          headers: {'Content-Type':'application/json'},
        });
        const data = await response.json();
        console.log("userdata", data);
        
        console.log("Logged-in username:", data.username);
        setUsername(data.username);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
      
      finally {
        setLoading(false);
      }

      
    };

    fetchData();
  }, []); // Empty dependency array to fetch only once on mount

  // Intersection Observer function to track videos' and images' visibility
  const handleIntersection = (entries) => {
    entries.forEach((entry) => {
      const index = entry.target.dataset.index;
      const videoElement = videoRefs.current[index];
      const audioElement = audioRefs.current[index];

      if (videoElement) {
        if (entry.isIntersecting) {
          // When video comes into view, play it if not already playing
          videoElement.play();
          setPlayingVideo(index); // Set the current video as playing
        } else {
          // When video goes out of view, pause it if it is playing
          videoElement.pause();
          if (playingVideo === index) {
            setPlayingVideo(null); // Reset the playing video if it's the one leaving
          }
        }
      }

      if (audioElement) {
        if (entry.isIntersecting) {
          // When audio comes into view, start playing if no other audio is playing
          if (playingAudio !== index) {
            if (playingAudio !== null && audioRefs.current[playingAudio]) {
              audioRefs.current[playingAudio].pause(); // Pause previous audio
            }
            audioElement.play();
            setPlayingAudio(index); // Set the current audio as playing
          }
        } else {
          // When audio goes out of view, pause it if it is playing
          audioElement.pause();
          if (playingAudio === index) {
            setPlayingAudio(null); // Reset the playing audio if it's the one leaving
          }
        }
      }
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.5, // Trigger when 50% of the element is visible
    });

    // Observing video elements
    videoRefs.current.forEach((videoElement) => {
      if (videoElement) {
        observer.observe(videoElement);
      }
    });

    // Observing audio elements
    audioRefs.current.forEach((audioElement) => {
      if (audioElement) {
        observer.observe(audioElement);
      }
    });

    return () => {
      // Clean up the observer
      videoRefs.current.forEach((videoElement) => {
        if (videoElement) {
          observer.unobserve(videoElement);
        }
      });

      audioRefs.current.forEach((audioElement) => {
        if (audioElement) {
          observer.unobserve(audioElement);
        }
      });
    };
  }, [posts, playingAudio, playingVideo]);

  // Handle click to play/pause audio
  const handleAudioClick = (postId, index) => {
    const audioElement = audioRefs.current[index];

    if (audioElement) {
      if (playingAudio !== index) {
        // Pause any currently playing audio
        if (playingAudio !== null && audioRefs.current[playingAudio]) {
          audioRefs.current[playingAudio].pause();
        }

        // Play the clicked audio
        audioElement.play();
        setPlayingAudio(index); // Set the new audio as playing
      } else {
        // If the same audio is clicked, toggle between play and pause
        if (audioElement.paused) {
          audioElement.play();
        } else {
          audioElement.pause();
        }
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow p-4 fixed w-full top-0 z-10">
        <div className="flex justify-between text-center font-bold">
          <Link to='/profilePage'>
            <img src="" alt="profile" className='bg-black h-10 w-10 rounded-full' />
          </Link>
          <h1>Social Hub</h1>
          <Link to='/postUploads' className='bg-blue-400 rounded-lg p-2 text-white'>Create</Link>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="mt-20 px-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading posts...</p>
        ) : posts.length > 0 ? (
          posts.map((post, index) => (
            <div
              key={post._id}
              className="bg-white rounded-lg shadow mb-6 overflow-hidden"
              data-index={index}
            >
              {/* Post Header */}
              <div className="flex items-center p-4 border-b">
                <div className="bg-blue-500 h-10 w-10 rounded-full"></div>
                <div className="ml-4">
                  <h3 className="text-sm font-bold">{post.userId.username}</h3>
                </div>
              </div>

              {/* Post Media (Video) */}
              {post.files && post.files.endsWith('.mp4') && (
                <video
                  ref={(el) => (videoRefs.current[index] = el)} // Assign ref for each video element
                  autoPlay={false} // Disable autoplay to control video manually
                  loop
                  muted
                  className="w-full h-auto object-cover cursor-pointer"
                  data-index={index} // Add data attribute to track index
                  controls // Show video controls
                >
                  <source src={`/api/${post.files}`} type="video/mp4" />
                  Your browser does not support the video element.
                </video>
              )}

              {/* Post Media (Image + Music) */}
              {post.files && (post.files.endsWith('.jpg') || post.files.endsWith('.jpeg') || post.files.endsWith('.png')) && (
                <img
                  src={`/api/${post.files}`}
                  alt="Post"
                  className="w-full h-auto object-cover cursor-pointer"
                  onClick={() => handleAudioClick(post._id, index)} // Play music on image click
                />
              )}

              {post.music && (
                <audio
                  ref={(el) => (audioRefs.current[index] = el)} // Assign ref for each audio element
                  className="hidden" // Hide the audio player element
                  controls // Show audio controls if desired
                >
                  <source src={`/api/${post.music}`} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
              )}
                  <div className="flex flex-col item-center ml-4">
                  <h3 className="text-sm font-bold">{username}</h3>
                  <p className="text-xs text-gray-500">
                    {new Date(post.postedDate).toLocaleString()}
                  </p>
                </div>
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
