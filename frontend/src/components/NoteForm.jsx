import { useState } from "react";
import api from "../api";

function NoteForm({ fetchNotes, disabled }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [generating, setGenerating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/notes", { title, content });
      setTitle("");
      setContent("");
      fetchNotes();
      setSuccess("Note added successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add note.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = () => {
    if (content.length < 10) {
      setError("Please write a few words to generate content.");
      return;
    }
    setGenerating(true);
    setError("");
    // Simulate a call to a generative AI model
    setTimeout(() => {
      const generatedText = `Here is a professionally-written expansion of your idea: "${content}". This can serve as a great starting point for your note!`;
      setContent(generatedText);
      setGenerating(false);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-gray-800 rounded-xl shadow-lg mb-6 transform transition-transform duration-300 hover:scale-[1.01]">
      <h2 className="text-2xl font-bold text-white mb-4">Create a New Note</h2>
      {error && (
        <div className="bg-red-500 text-white text-sm p-3 rounded-md mb-4 animate-fade-in-down">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-500 text-white text-sm p-3 rounded-md mb-4 animate-fade-in-down">
          {success}
        </div>
      )}
      <input
        className="w-full p-4 mb-3 bg-gray-700 text-gray-200 rounded-lg border border-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        disabled={disabled || loading}
      />
      <textarea
        className="w-full p-4 mb-3 h-32 bg-gray-700 text-gray-200 rounded-lg border border-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors resize-none"
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        disabled={disabled || loading}
      />
      <div className="flex gap-2">
        <button
          className={`flex-1 p-3 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 ${
            loading
              ? "bg-blue-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:scale-95"
          }`}
          type="submit"
          disabled={disabled || loading}
        >
          {loading ? "Adding Note..." : "Add Note"}
        </button>
        <button
          className={`p-3 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 ${
            generating
              ? "bg-purple-500 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 active:scale-95"
          }`}
          type="button"
          onClick={handleGenerate}
          disabled={disabled || generating}
        >
          {generating ? "Generating..." : "Generate Content"}
        </button>
      </div>
    </form>
  );
}

export default NoteForm;