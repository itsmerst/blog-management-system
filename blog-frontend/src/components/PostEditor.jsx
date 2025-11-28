// src/components/PostEditor.jsx
import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import API from "../api";
import "react-quill/dist/quill.snow.css";

export default function PostEditor({ user }) {
  const [title, setTitle] = useState("");
  const [categories, setCategories] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // load posts by author
  const loadPosts = async () => {
    try {
      const res = await API.get(
        `/api/posts?author=${encodeURIComponent(user.username)}`
      );
      setPosts(res.data || []);
    } catch (e) {
      console.error("Failed to load posts", e);
      setPosts([]);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const resetForm = () => {
    setTitle("");
    setCategories("");
    setTags("");
    setContent("");
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setMessage({ type: "error", text: "Title is required" });
      return;
    }
    if (!content || content.trim() === "" || content === "<p><br></p>") {
      setMessage({ type: "error", text: "Content is required" });
      return;
    }

    const body = {
      title: title.trim(),
      content,
      author: user.username,
      categories: categories
        ? categories
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      tags: tags
        ? tags
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
    };

    setLoading(true);
    setMessage(null);

    try {
      if (editingId) {
        await API.put(`/api/posts/${editingId}`, body);
        setMessage({ type: "success", text: "Post updated successfully" });
      } else {
        await API.post("/api/posts", body);
        setMessage({ type: "success", text: "Post published successfully" });
      }
      resetForm();
      await loadPosts();
    } catch (err) {
      console.error("Save failed", err);
      setMessage({
        type: "error",
        text: "Failed to save post. Check console for details.",
      });
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (post) => {
    setEditingId(post.id);
    setTitle(post.title || "");
    setCategories((post.categories || []).map((c) => c.name).join(", "));
    setTags((post.tags || []).map((t) => t.name).join(", "));
    setContent(post.content || "");
    // scroll to editor (nice UX)
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this post?")) return;
    try {
      await API.delete(`/api/posts/${id}`);
      setMessage({ type: "success", text: "Post deleted" });
      loadPosts();
    } catch (e) {
      console.error("Delete failed", e);
      setMessage({ type: "error", text: "Delete failed" });
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow space-y-6">
      <div>
        <h3 className="text-lg font-semibold">
          {editingId ? "Edit Post" : "Create Post"}
        </h3>
        <p className="text-sm text-gray-500">
          Write your title, content, categories and tags. Click Publish below
          the editor.
        </p>
      </div>

      {message && (
        <div
          className={`p-3 rounded ${
            message.type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-3">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded p-2"
        />

        <div className="grid sm:grid-cols-2 gap-3">
          <input
            placeholder="Categories (comma separated)"
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
            className="w-full border rounded p-2"
          />
          <input
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Editor */}
        <div>
          <ReactQuill
            value={content}
            onChange={setContent}
            theme="snow"
            style={{ minHeight: 240 }}
          />
        </div>

        {/* Publish / Update buttons: placed BELOW the editor */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2">
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-gradient-to-br from-indigo-600 to-pink-500 text-white px-5 py-2 rounded-md shadow hover:brightness-105 disabled:opacity-60"
            >
              {loading
                ? editingId
                  ? "Updating..."
                  : "Publishing..."
                : editingId
                ? "Update"
                : "Publish"}
            </button>

            {editingId && (
              <button
                onClick={() => resetForm()}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
            )}
          </div>

          <div className="text-sm text-gray-500">
            Tip: Use categories and tags to improve discoverability.
          </div>
        </div>
      </div>

      {/* Your posts list */}
      <div>
        <h4 className="font-medium mb-2">Your Posts</h4>
        <ul className="space-y-3 max-h-64 overflow-auto">
          {posts.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between border rounded p-3"
            >
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{p.title}</div>
                <div className="text-xs text-gray-500 truncate">
                  {(p.categories || []).map((c) => c.name).join(", ")}
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => startEdit(p)}
                  className="text-sm text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-sm text-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
          {posts.length === 0 && (
            <li className="text-sm text-gray-500">No posts yet</li>
          )}
        </ul>
      </div>
    </div>
  );
}
