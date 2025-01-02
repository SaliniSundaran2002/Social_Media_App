import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Register = () => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, username, password } = formData;

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials:"include",
        body: JSON.stringify({ name, email, username, password }),
      });
    //   console.log("status", response.status);
      

      const data = await response.json();

      if (response.status === 201) {
        toast.success(data.message);
        navigate('/login'); 
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md border border-gray-300 rounded-lg shadow-lg p-8 bg-white mt-24">
        <h2 className="text-2xl font-semibold mb-6 text-center bg-gradient-to-r from-blue-500 to-pink-600 bg-clip-text text-transparent">
          Register
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full border border-blue-500 p-4 rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border border-blue-500 p-4 rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
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
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full border border-blue-500 p-4 rounded-lg "
            />
          </div>


          <div className="flex justify-center items-center mb-4">
            <button  className="text-center w-full bg-gradient-to-r from-blue-500 to-pink-600 text-white p-3 rounded-lg border border-blue-500 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/50 transition duration-300">
              Register
            </button>
          </div>

          <div className="text-center">
            <p>Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
