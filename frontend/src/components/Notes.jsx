import { useEffect, useState } from "react";
import api from "../api";
import NoteForm from "./NoteForm";

function Notes({ user }) {
  const [notes, setNotes] = useState([]);
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");

  const fetchNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/notes");
      setNotes(res.data.notes);
      setTenant(res.data.tenant);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch notes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (note) => {
    setEditingNoteId(note._id);
    setEditedTitle(note.title);
    setEditedContent(note.content);
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditedTitle("");
    setEditedContent("");
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/notes/${editingNoteId}`, {
        title: editedTitle,
        content: editedContent,
      });
      fetchNotes();
      handleCancelEdit();
    } catch (err) {
      console.error(err);
      setError("Failed to update note. Please try again.");
    }
  };

  const deleteNote = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      fetchNotes();
    } catch (err) {
      console.error(err);
      setError("Failed to delete note. Please try again.");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const isLimitReached = tenant?.plan === "free" && notes.length >= tenant?.noteLimit;

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-gray-100 font-sans">
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-extrabold text-blue-500">Your Notes</h2>
        {user && <span className="text-gray-400">Logged in as: {user.email}</span>}
      </header>

      <div className="mb-8">
        <NoteForm fetchNotes={fetchNotes} disabled={isLimitReached} />
        {isLimitReached && (
          <div className="bg-yellow-800 text-yellow-200 p-4 rounded-lg shadow-inner text-center animate-fade-in-up">
            <p className="font-semibold">Note limit reached!</p>
            <p className="text-sm mt-1">
              You've hit your limit of {tenant.noteLimit} notes on the free plan. Upgrade to Pro to add more!
            </p>
          </div>
        )}
      </div>

      {loading && (
        <div className="flex justify-center items-center h-48 text-gray-400">
          <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="ml-4 text-xl">Loading notes...</span>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-800 text-red-200 p-4 rounded-lg text-center">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && notes.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 bg-gray-800 rounded-lg shadow-inner">
          <p className="text-gray-400 text-xl mb-4">You have no notes yet.</p>
          <p className="text-gray-500">Start by creating your first note above!</p>
        </div>
      )}

      {!loading && notes.length > 0 && (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {notes.map((note) => (
            <li
              key={note._id}
              className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105"
            >
              {editingNoteId === note._id ? (
                // Edit Mode
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-transparent focus:border-blue-500 focus:outline-none transition-colors"
                  />
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full p-3 h-32 bg-gray-700 text-white rounded-lg border border-transparent focus:border-blue-500 focus:outline-none transition-colors resize-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleUpdate}
                      className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white leading-tight pr-4">{note.title}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(note)}
                        className="text-yellow-400 hover:text-yellow-500 transition-colors duration-200"
                        aria-label="Edit note"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-5.657 5.657l-1.414 1.414a1 1 0 000 1.414l4.243 4.243a1 1 0 001.414 0l1.414-1.414-5.657-5.657z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteNote(note._id)}
                        className="text-red-400 hover:text-red-500 transition-colors duration-200"
                        aria-label="Delete note"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-400 whitespace-pre-wrap">{note.content}</p>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notes;