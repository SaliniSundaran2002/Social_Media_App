import React from 'react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <>
      <nav className="flex justify-between items-center p-4 bg-blue-400">
        <Link to='/register' className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
          Register
        </Link>
        <Link to='/login' className="px-4 py-2 text-blue-600 bg-white border border-blue-600 rounded hover:bg-blue-100">
          Login
        </Link>
      </nav>
    </>
  );
};

export default Index;
