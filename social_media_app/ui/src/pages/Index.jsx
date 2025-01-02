import React from 'react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://source.unsplash.com/1600x900/?social-media,technology')" }}>
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-screen text-white text-center px-4">
        <h1 className="text-blue-500 text-4xl sm:text-6xl font-bold mb-4">Welcome to the SocialHub</h1>
        <p className="text-xl sm:text-2xl mb-6 text-pink-400">Connect, Share, and Discover new people around the world.</p>

        {/* Navigation Section */}
        <nav className="flex justify-center space-x-6">
          <Link
            to='/register'
            className="px-6 py-3 text-white bg-blue-600 rounded-full text-lg font-semibold transition duration-300 ease-in-out transform hover:bg-blue-700 hover:scale-105"
          >
            Register
          </Link>
          <Link
            to='/login'
            className="px-6 py-3 text-blue-600 bg-white border-2 border-blue-600 rounded-full text-lg font-semibold transition duration-300 ease-in-out transform hover:bg-blue-100 hover:scale-105"
          >
            Login
          </Link>
        </nav>
      </section>

      {/* Footer Section */}
      
    </div>
  );
};

export default Index;
