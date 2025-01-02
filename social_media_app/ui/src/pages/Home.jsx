import React from 'react';
import image from '../assets/img2.jpeg';

const Home = () => {
  return (
    <div className="bg-white h-screen p-4">
      <h1 className="text-center text-3xl font-semibold mb-6">Image Gallery</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="image-item">
          <div className="relative w-full pb-[125%]"> {/* 4:5 aspect ratio */}
            <img 
              src={image} 
              alt="Image 1" 
              className="absolute top-0 left-0 w-full h-full object-cover rounded-lg" 
            />
          </div>
        </div>
        {/* Add more images as needed */}
      </div>
    </div>
  );
};

export default Home;
