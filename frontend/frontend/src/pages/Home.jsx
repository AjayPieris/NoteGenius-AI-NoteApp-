// src/pages/Home.jsx
import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function Home() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  // NEW: Get username from storage
  const [username, setUsername] = useState(localStorage.getItem("USERNAME") || "User");
  const navigate = useNavigate();

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = async () => {
    try {
      const res = await api.get("/notes/");
      setNotes(res.data);
    } catch (err) {
      alert("Error fetching notes!");
    }
  };

  const deleteNote = async (id) => {
    if (window.confirm("Delete this note?")) {
        try {
            const res = await api.delete(`/notes/${id}/`);
            if (res.status === 204) getNotes();
        } catch (err) {
            alert("Error deleting note.");
        }
    }
  };

  const createNote = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const res = await api.post("/notes/", { content });
      if (res.status === 201) {
        setContent("");
        getNotes();
      }
    } catch (err) {
      alert("Failed to make note.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 transition-all">
      <div className="max-w-7xl mx-auto animate-slide-up">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              NoteGenius
            </h1>
            <p className="text-gray-500 mt-1 text-lg">
              Hello, <span className="text-blue-600 font-bold capitalize">{username}</span>! 👋
            </p>
          </div>
          
          <button 
            onClick={handleLogout} 
            className="bg-white text-red-500 border border-red-200 font-semibold py-2 px-6 rounded-full hover:bg-red-50 hover:border-red-300 transition duration-300 shadow-sm"
          >
            Logout
          </button>
        </div>

        {/* INPUT SECTION */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-12 border border-gray-100 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-2 h-full bg-blue-500 transition-all duration-300 group-hover:w-full group-hover:opacity-5"></div>
          
          <h3 className="text-xl font-bold text-gray-800 mb-4 relative z-10">🚀 Capture an Idea</h3>
          <form onSubmit={createNote} className="relative z-10">
            <textarea
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none h-32 text-gray-700"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind? (AI will handle the rest...)"
            ></textarea>
            
            <div className="mt-4 flex justify-end">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className={`py-3 px-8 rounded-xl font-bold text-white shadow-lg transform transition hover:-translate-y-1 ${
                    loading ? "bg-gray-400 cursor-wait" : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  }`}
                >
                  {loading ? "Analyzing..." : "Save Smart Note"}
                </button>
            </div>
          </form>
        </div>

        {/* NOTES GRID */}
        {notes.length === 0 ? (
           <div className="text-center py-20 opacity-50">
             <p className="text-2xl font-bold text-gray-400">No notes yet. Start writing!</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {notes.map((note, index) => (
              <div 
                key={note.id} 
                className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition duration-500 border border-transparent hover:border-blue-100 overflow-hidden relative group animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }} // Staggered Animation
              >
                
                {/* Delete Button */}
                <button 
                    onClick={() => deleteNote(note.id)}
                    className="text-black/20 hover:text-red-600 absolute top-4 right-4 text-lg font-extrabold transition-colors "
                    title="Delete"
                >
                    ✕
                </button>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-xl font-black text-gray-800 mb-3 leading-snug group-hover:text-blue-600 transition-colors">
                    {note.ai_title || "Untitled Idea"}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    {note.content}
                  </p>

                  {/* AI Summary Section */}
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-100 relative">
                    <span className="absolute -top-3 left-4 bg-white text-indigo-600 text-[10px] font-bold px-2 py-1 rounded-full border border-indigo-100 shadow-sm tracking-wider uppercase">
                      AI Summary
                    </span>
                    <p className="text-sm text-gray-700 font-medium italic mt-2">
                      "{note.ai_summary}"
                    </p>
                  </div>
                </div>
                
                {/* Footer (Tags + Date) */}
                <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-100 flex flex-wrap gap-2 items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {note.ai_tags && note.ai_tags.split(',').map((tag, i) => (
                      <span key={i} className="text-[11px] font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                    {new Date(note.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Home;