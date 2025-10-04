import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, LogOut } from "lucide-react"; 
import { useNavigate } from "react-router-dom";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [data, setData] = useState({ title: "", content: "", tags: "" });
  const [search, setSearch] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const fetchNotes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notes", {
        headers: { Authorization: token },
        params: { search }
      });
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [search]);

  // Save (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const tagsArray =
      data.tags.trim() === "" ? ["None"] : data.tags.split(",").map(t => t.trim());

    if (editMode && selectedNote) {
      await axios.put(
        `http://localhost:5000/api/notes/${selectedNote._id}`,
        { ...data, tags: tagsArray },
        { headers: { Authorization: token } }
      );
    } else {
      await axios.post(
        "http://localhost:5000/api/notes",
        { ...data, tags: tagsArray },
        { headers: { Authorization: token } }
      );
    }

    setData({ title: "", content: "", tags: "" });
    setEditMode(false);
    setSelectedNote(null);
    fetchNotes();
  };

  // Delete
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/notes/${id}`, {
      headers: { Authorization: token }
    });
    setSelectedNote(null);
    fetchNotes();
  };

  // Edit note
  const handleEdit = (note) => {
    setSelectedNote(note);
    setData({
      title: note.title,
      content: note.content,
      tags: note.tags.join(",")
    });
    setEditMode(true);
  };

  // Create new note
  const handleNewNote = () => {
    setSelectedNote(null);
    setData({ title: "", content: "", tags: "" });
    setEditMode(true);
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="notes-layout">
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>My Notes</h3>
          <button className="add-btn" onClick={handleNewNote}>
            <Plus size={18} />
          </button>
        </div>

        <input
          className="search-box"
          placeholder="Search "
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="note-list">
          {notes.length === 0 ? (
            <p className="no-result">No results found</p>
          ) : (
            notes.map((n) => (
              <div
                key={n._id}
                className={`note-item ${
                  selectedNote && selectedNote._id === n._id ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedNote(n);
                  setEditMode(false);
                }}
              >
                <h4>{n.title}</h4>
                <div className="note-separator"></div>
              </div>
            ))
          )}
        </div>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>
      <div className="note-content">
        {!selectedNote && !editMode && (
          <p className="placeholder">Select a note or create a new one</p>
        )}

        {editMode && (
          <form onSubmit={handleSubmit} className="note-form">
            <input
              placeholder="Title"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
            />
            <textarea
              placeholder="Content"
              value={data.content}
              onChange={(e) => setData({ ...data, content: e.target.value })}
            />
            <input
              placeholder="Tags"
              value={data.tags}
              onChange={(e) => setData({ ...data, tags: e.target.value })}
            />
            <div className="form-actions">
              <button type="submit">
                {selectedNote ? "Update Note" : "Add Note"}
              </button>
              <button type="button" onClick={() => setEditMode(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {!editMode && selectedNote && (
          <div className="note-details">
            <h2>{selectedNote.title}</h2>
            <p>{selectedNote.content}</p>
            <p>
              <b>Tags:</b>{" "}
              {selectedNote.tags && selectedNote.tags.length > 0
                ? selectedNote.tags.join(", ")
                : "None"}
            </p>
            <div className="note-actions">
              <button onClick={() => handleEdit(selectedNote)}>Edit</button>
              <button onClick={() => handleDelete(selectedNote._id)}>
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
