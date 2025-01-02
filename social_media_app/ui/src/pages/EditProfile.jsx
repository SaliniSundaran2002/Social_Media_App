import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditProfile = () => {
  const [files, setFiles] = useState({
    profilePic: null,
  });
  const navigate = useNavigate();

  const [bio, setBio] = useState('');
  const [gender, setGender] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [birthday, setBirthday] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState(''); // Holds the URL of the profile pic

  // Fetch the current user data when the component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      const response = await fetch('/api/profile');
      const data = await response.json();
      if (data.user) {
        setProfilePicUrl(data.user.profilePic);  // Set the current profile pic URL from backend
        setBio(data.user.bio);
        setGender(data.user.gender);
        setPhonenumber(data.user.phonenumber);
        setBirthday(data.user.birthday);
      }
    };

    fetchProfileData();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    
    // If a new profile picture is selected, append it to formData
    if (files.profilePic) {
      formData.append('profilePic', files.profilePic);
    } else {
      formData.append('profilePic', profilePicUrl); // Send the current profile pic if no new one
    }

    formData.append('bio', bio);
    formData.append('gender', gender);
    formData.append('phonenumber', phonenumber);
    formData.append('birthday', birthday);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();

      if (response.status === 200) {
        toast.success('Profile updated successfully!');
        navigate('/profilePage');
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error:', error.message);
      toast.error('An error occurred while updating the profile.');
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles((prevData) => ({
      ...prevData,
      [name]: selectedFiles[0],
    }));
  };

  const handleBioChange = (e) => setBio(e.target.value);
  const genderChange = (e) => setGender(e.target.value);
  const phonenumberChange = (e) => setPhonenumber(e.target.value);
  const birthdayChange = (e) => setBirthday(e.target.value);

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center bg-gradient-to-r from-blue-500 to-pink-600 bg-clip-text text-transparent">
        Edit Profile
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Profile Picture */}
        <div>
          <label htmlFor="profilePic" className="block text-gray-700">
            Change Profile Picture
          </label>
          <input
            type="file"
            id="profilePic"
            name="profilePic"
            accept="image/*"
            onChange={handleChange}
            className="w-full mt-2 p-2 border border-blue-500 rounded-lg"
          />
          {/* Display current profile pic */}
          {profilePicUrl && (
            <div className="mt-2">
              <img
                src={`/${profilePicUrl}`}
                alt="Current Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-gray-700">
            Bio
          </label>
          <textarea
            id="bio"
            className="w-full mt-2 p-2 border border-blue-500 rounded-lg"
            rows="2"
            onChange={handleBioChange}
            value={bio}
            placeholder="Tell us something about yourself..."
          ></textarea>
        </div>

        {/* Gender */}
        <div>
          <label htmlFor="gender" className="block text-gray-700">
            Gender
          </label>
          <select
            id="gender"
            className="mt-2 p-2 border border-blue-500 rounded-lg w-full"
            onChange={genderChange}
            value={gender}
          >
            <option value="">Select Gender</option>
            <option value="he/him">he/him</option>
            <option value="she/her">she/her</option>
            <option value="prefer not to say">prefer not to say</option>
          </select>
        </div>

        {/* Birthday */}
        <div>
          <label htmlFor="birthday" className="block text-gray-700">
            Birthday
          </label>
          <input
            type="date"
            id="birthday"
            className="mt-2 p-2 border border-blue-500 rounded-lg w-full"
            onChange={birthdayChange}
            value={birthday}
          />
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phonenumber" className="block text-gray-700">
            Phone Number
          </label>
          <input
            type="text"
            id="phonenumber"
            onChange={phonenumberChange}
            value={phonenumber}
            className="w-full mt-2 p-2 border border-blue-500 rounded-lg"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="text-center w-full bg-gradient-to-r from-blue-500 to-pink-600 text-white p-3 rounded-lg border border-blue-500 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/50 transition duration-300"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
