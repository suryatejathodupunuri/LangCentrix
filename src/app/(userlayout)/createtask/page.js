'use client';

import { useState } from 'react';

export default function CreateTaskPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can later send this to your backend API
    console.log('Task Created:', { title, description });
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Task</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 border border-gray-200 rounded-md shadow">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            className="w-full border border-gray-300 p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
            rows={4}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Task
        </button>
      </form>
    </div>
  );
}
