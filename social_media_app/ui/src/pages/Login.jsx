import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormdata] = useState({
    username: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;

    const response = await fetch('/api/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (response.status == 200) {
        toast.success(data.message);
      navigate('/home'); 
    } else {
      console.error('Login failed');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md border-2 border-transparent rounded-lg p-8 relative overflow-hidden shadow-lg bg-white mt-24">
        <h2 className="text-2xl font-semibold mb-6 text-center bg-gradient-to-r from-blue-500 to-pink-600 bg-clip-text text-transparent">Login</h2>
        <form className="ml-2" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700">Username:</label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="w-full border border-blue-500 p-4 rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Password:</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full border border-blue-500 p-4 rounded-lg"
            />
          </div>

          <div className="flex justify-center items-center mb-4">
            <button type="submit" className="text-center w-full bg-gradient-to-r from-blue-500 to-pink-600 text-white p-3 rounded-lg border border-blue-500 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/50 transition duration-300">
              Login
            </button>
          </div>

          <div>
            <p>Don’t have an account? <Link to="/register" className="text-blue-600">Register</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
