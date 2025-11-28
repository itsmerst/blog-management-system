import React, { useEffect, useState } from "react";
import API from "../api";

export default function ReaderPanel({ user, onLogout }) {
  const [posts, setPosts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    API.get("/api/posts")
      .then((r) => setPosts(r.data || []))
      .catch((e) => {
        console.error("Failed to load posts", e);
        setPosts([]);
      });
  }, []);

  // robust comment loader: primary endpoint and fallback
  const fetchComments = async (postId) => {
    setLoadingComments(true);
    try {
      // try primary endpoint
      const res = await API.get(`/api/posts/${postId}/comments`);
      if (res?.data) {
        setComments(res.data || []);
        setLoadingComments(false);
        return;
      }
    } catch (e) {
      // continue to fallback
      console.warn("GET /api/posts/{id}/comments failed, trying fallback", e);
    }

    try {
      // fallback query-based endpoint
      const res2 = await API.get(`/api/comments`, { params: { postId } });
      setComments(res2.data || []);
    } catch (e2) {
      console.error("Failed to load comments (both endpoints)", e2);
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const open = (p) => {
    setSelected(p);
    fetchComments(p.id);
  };

  const submitComment = async () => {
    if (!selected) return alert("Select a post first");
    const trimmed = (newComment || "").trim();
    if (!trimmed) return alert("Comment cannot be empty");

    const payload = { content: trimmed, username: user?.username || "Guest" };

    // optimistic id for temporary UI (negative to avoid clash)
    const tempId = `tmp-${Date.now()}`;

    // optimistic update: show immediately
    const optimisticComment = {
      id: tempId,
      content: trimmed,
      user: user ? { username: user.username } : null,
      username: user?.username,
    };
    setComments((c) => [...c, optimisticComment]);
    setNewComment("");
    setPosting(true);

    try {
      // primary POST endpoint
      const postRes = await API.post(
        `/api/posts/${selected.id}/comments`,
        payload
      );

      // if server returns created comment, use it (replace optimistic)
      if (postRes && postRes.data) {
        const created = postRes.data;
        setComments((list) =>
          list.map((it) => (it.id === tempId ? created : it))
        );
      } else {
        // server didn't return comment body, refetch comments to be safe
        await fetchComments(selected.id);
      }
    } catch (err) {
      console.error("Posting comment failed", err);

      // If POST failed: remove optimistic comment and show error
      setComments((list) => list.filter((it) => it.id !== tempId));
      // try alternative POST path (some backends accept /api/comments with postId)
      try {
        const altRes = await API.post(`/api/comments`, {
          ...payload,
          postId: selected.id,
        });
        if (altRes && altRes.data) {
          // append returned comment
          setComments((list) => [...list, altRes.data]);
        } else {
          alert(
            "Failed to post comment (server returned no data). Check server logs."
          );
        }
      } catch (altErr) {
        console.error("Alternative POST failed", altErr);
        alert(
          "Failed to post comment. Check console / network tab for details."
        );
      }
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold">Reader</h2>
        <p className="text-sm text-gray-500">
          Welcome, {user?.username || "Guest"}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white p-4 rounded shadow">
          <h3 className="font-medium mb-2">Posts</h3>
          <ul className="space-y-2">
            {posts.map((p) => (
              <li key={p.id}>
                <button
                  className={`text-left w-full py-2 ${
                    selected?.id === p.id ? "font-semibold" : ""
                  }`}
                  onClick={() => open(p)}
                >
                  {p.title}
                </button>
              </li>
            ))}
            {posts.length === 0 && (
              <li className="text-sm text-gray-500">No posts yet</li>
            )}
          </ul>
        </div>

        <div className="md:col-span-2 bg-white p-4 rounded shadow">
          {selected ? (
            <>
              <h3 className="text-xl font-semibold">{selected.title}</h3>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: selected.content }}
              />

              <div className="mt-4">
                <h4 className="font-medium flex items-center justify-between">
                  Comments
                  <span className="text-xs text-gray-500">
                    {loadingComments ? "Loading..." : `${comments.length}`}
                  </span>
                </h4>

                <ul className="space-y-2 mt-3">
                  {comments.map((c) => {
                    const username =
                      (c.user && c.user.username) || c.username || "Guest";
                    return (
                      <li key={c.id} className="border-b pb-2">
                        <div className="text-sm font-semibold">{username}</div>
                        <div className="text-sm text-gray-700">{c.content}</div>
                      </li>
                    );
                  })}
                  {comments.length === 0 && !loadingComments && (
                    <li className="text-sm text-gray-500">
                      No comments yet — be first!
                    </li>
                  )}
                </ul>

                <div className="mt-4">
                  <textarea
                    className="w-full border rounded p-2"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write your comment..."
                    rows={4}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
                      onClick={submitComment}
                      disabled={posting}
                    >
                      {posting ? "Posting..." : "Post"}
                    </button>
                    <button
                      className="px-4 py-2 border rounded"
                      onClick={() => setNewComment("")}
                      disabled={posting}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-gray-500">Select a post to read</div>
          )}
        </div>
      </div>
    </div>
  );
}
