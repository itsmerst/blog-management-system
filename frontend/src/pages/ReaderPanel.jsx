import React, {useEffect, useState} from 'react';
import { apiFetch } from '../api';

export default function ReaderPanel({user, onLogout}) {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    apiFetch('/api/posts', {method:'GET'}).then(r=>r.json()).then(setPosts).catch(()=>{});
  },[]);

  const loadComments = (postId) => {
    // For simplicity we fetch all and filter; better endpoint would be /api/posts/{id}/comments
    apiFetch('/api/comments', {method:'GET'}).then(r=>r.json()).then(all=>{
      setComments(all.filter(c => c.post && c.post.id === postId));
    }).catch(()=>{});
  };

  const selectPost = (post) => {
    setSelectedPost(post);
    loadComments(post.id);
  };

  const addComment = async () => {
    if(!selectedPost) return;
    const res = await apiFetch('/api/posts/' + selectedPost.id + '/comments', {
      method:'POST',
      body: JSON.stringify({content:newComment, username:user.username})
    });
    if(res.ok) {
      setNewComment('');
      loadComments(selectedPost.id);
    }
  };

  return <div>
    <h2>Reader Dashboard</h2>
    <p>Welcome, {user.username}</p>
    <button onClick={onLogout}>Logout</button>

    <h3>Posts</h3>
    <ul>
      {posts.map(p=>(
        <li key={p.id}>
          <button onClick={()=>selectPost(p)}>{p.title}</button>
        </li>
      ))}
    </ul>

    {selectedPost && (
      <div>
        <h3>{selectedPost.title}</h3>
        <div dangerouslySetInnerHTML={{__html:selectedPost.content}}></div>
        <h4>Comments</h4>
        <ul>
          {comments.map(c=>(
            <li key={c.id}>{(c.user && c.user.username) || 'Guest'}: {c.content}</li>
          ))}
        </ul>
        <textarea placeholder='Add comment' value={newComment} onChange={e=>setNewComment(e.target.value)}/>
        <br/>
        <button onClick={addComment}>Post Comment</button>
      </div>
    )}
  </div>;
}
