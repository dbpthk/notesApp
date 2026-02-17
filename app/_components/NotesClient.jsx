"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";

const NotesClient = ({ initialNotes }) => {
  const [notes, setNotes] = useState(initialNotes);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingContent, setEditingContent] = useState("");
  console.log(initialNotes);

  const createNote = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });
      const result = await response.json();
      if (result.success) {
        setNotes([result.data, ...notes]);
        toast.success("note created");
        setTitle("");
        setContent("");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error creating note", error);
      toast.error("something went wrong");
    }
  };

  const deleteNote = async (id) => {
    try {
      const response = await fetch(`api/notes/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        setNotes(notes.filter((note) => note._id !== id));
        toast.success("Note deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting note");
      toast.error("something went wrong");
    }
  };

  const startEdit = (note) => {
    setEditingId(note._id);
    setEditingTitle(note.title);
    setEditingContent(note.content);
  };
  const cancelEdit = (note) => {
    setEditingId(null);
    setEditingTitle("");
    setEditingContent("");
  };

  const updateNote = async (id) => {
    if (!editingTitle.trim() || !editingContent.trim()) return;
    setLoading(true);

    try {
      const response = await fetch(`api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editingTitle, content: editingContent }),
      });
      const result = await response.json();

      if (result.success) {
        toast.success("Notes updated succesfully");
        setNotes(notes.map((note) => (note._id === id ? result.data : note)));
        setEditingId(null);
        setTitle("");
        setContent("");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error updating note", error);
      toast.error("something went wrong");
    }
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={createNote}
        action=""
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-cl text-gray-800 font-semibold mb-4">
          Create New Note
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Note Title"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            required
          />
          <textarea
            placeholder="note content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-3 py-2 rounded-md text-lg font-semibold bg-blue-500 hover:bg-blue-700 text-white disabled:opacity-50"
          >
            {loading ? "Creating" : "Create a Note"}
          </button>
        </div>
      </form>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Notes ({notes.length})</h2>
        {notes.length === 0 ? (
          <p className="text-gray-500">
            You have no previous notes, create a new one
          </p>
        ) : (
          notes.map((note) => (
            <div className=" bg-white p-6 rounded-lg shadow-md" key={note._id}>
              {editingId === note._id ? (
                <>
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.currentTarget.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="flex  gap-3 mb-3">
                      <button
                        className="px-3 py-2 text-sm font-semibold text-white bg-green-500 rounded-lg hover:bg-green-700"
                        onClick={() => updateNote(note._id)}
                      >
                        Save
                      </button>

                      <button
                        className="px-3 py-2 text-sm font-semibold text-white rounded-lg bg-gray-500 hover:bg-gray-700 
                  
                  "
                        onClick={() => cancelEdit(note._id)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-row  justify-between gap-5">
                    <h2 className="text-lg font-semibold">{note.title}</h2>

                    <div className="flex  gap-3 mb-3">
                      <button
                        className="px-3 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-700"
                        onClick={() => startEdit(note)}
                      >
                        Edit
                      </button>

                      <button
                        className="px-3 py-2 text-sm font-semibold text-white rounded-lg bg-red-500 hover:bg-red-700 
                  
                  "
                        onClick={() => deleteNote(note._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">{note.content}</p>
                </>
              )}

              <p className="text-sm text-gray-500">
                Created: {new Date(note.createdAt).toLocaleDateString()}
              </p>
              {note.updatedAt !== note.createdAt && (
                <p className="text-sm text-gray-500">
                  Updated: {new Date(note.updatedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotesClient;
