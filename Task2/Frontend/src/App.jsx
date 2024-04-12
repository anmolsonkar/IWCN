import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Delete, Menu } from "@mui/icons-material";

const API_URL = 'http://localhost:4000';

function App() {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  // Fetch notes on component mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get(`${API_URL}/notes`);
        setNotes(response.data);
      } catch (err) {
        console.error('Error fetching notes:', err);
      }
    };
    fetchNotes();
  }, []);

  // Handle input change
  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.title.trim() === '' || formData.content.trim() === '') {
      // Display an error message or do nothing if either field is empty
      console.log('Please fill in both title and content');
      return;
    }

    try {
      await axios.post(`${API_URL}/notes`, formData);
      // Clear form data and refetch notes
      setFormData({ title: '', content: '' });
      const response = await axios.get(`${API_URL}/notes`);
      setNotes(response.data);
    } catch (err) {
      console.error('Error adding note:', err);
    }
  };

  // Handle deleting a note
  const handleDeleteNote = async (noteId) => {
    try {
      await axios.delete(`${API_URL}/notes/${noteId}`);
      // Filter out the deleted note from the state
      setNotes(notes.filter((note) => note.id !== noteId));
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-[#202424] fixed top-0 left-0 h-14 w-full text-white text-2xl items-center flex pl-2 space-x-2">
        <Menu />
        <span>
          Notes
        </span>
      </div>

      <div className='flex justify-center mt-20'>
        <div className="bg-[#e4dccc] shadow-md rounded px-8 pt-6 pb-8 mb-4 lg:w-5/12 w-full">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder='Add Title'
                value={formData.title}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="content"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Content
              </label>
              <textarea
                id="content"
                name="content"
                placeholder='Take a note...'
                value={formData.content}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                required
              ></textarea>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-[#556767] hover:bg-[#3d4747] text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Add Note
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5">
        {notes.map((note) => (
          <div
            key={note.id}
            className="bg-[#e4dccc] rounded shadow-md p-4"
          >
            <h2 className="text-lg font-bold mb-2">{note.title}</h2>
            <p className="text-gray-700">{note.content}</p>
            <div className='flex items-center justify-between px-2 pl-0'>
              {new Date(note.created_at).toLocaleString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
              })}
              <Delete className='text-[#3d4747] cursor-pointer' onClick={() => handleDeleteNote(note.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;