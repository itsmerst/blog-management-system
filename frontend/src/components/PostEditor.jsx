import React, {useEffect, useRef, useState} from 'react';
import Quill from 'quill';
import { apiFetch } from '../api';

export default function PostEditor({user}) {
  const editorRef = useRef();
  const [quill, setQuill] = useState(null);
  const [title, setTitle] = useState('');
  const [categories, setCategories] = useState('');
  const [tags, setTags] = useState('');
  const [posts, setPosts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const q = new Quill(editorRef.current, { theme: 'snow' });
    setQuill(q);
  },[]);

  const loadPosts = () => {
    apiFetch('/api/posts', {method:'GET'}).then(r=>r.json()).then(setPosts).catch(()=>{});
  };

  useEffect(() => { loadPosts(); },[]);

  const handleSubmit = async () => {
    const content = quill.root.innerHTML;
    const body = {
      title,
      content,
      author: user.username,
      categories: categories ? categories.split(',').map(s=>s.trim()).filter(Boolean) : [],
      tags: tags ? tags.split(',').map(s=>s.trim()).filter(Boolean) : []
    };
    let res;
    if(editingId) {
      res = await apiFetch('/api/posts/' + editingId, {
        method:'PUT',
        body: JSON.stringify(body)
      });
    } else {
      res = await apiFetch('/api/posts', {
        method:'POST',
        body: JSON.stringify(body)
      });
    }
    if(res.ok) {
      setTitle(''); setCategories(''); setTags(''); quill.setText('');
      setEditingId(null);
      loadPosts();
    } else {
      alert('Error saving post');
    }
  };

  const startEdit = (post) => {
    setEditingId(post.id);
    setTitle(post.title);
    setCategories(post.categories ? post.categories.map(c=>c.name).join(',') : '');
    setTags(post.tags ? post.tags.map(t=>t.name).join(',') : '');
    if(quill) quill.root.innerHTML = post.content || '';
  };

  const del = async (id) => {
    const res = await apiFetch('/api/posts/' + id, {method:'DELETE'});
    if(res.ok) loadPosts();
    else alert('Delete failed');
  };

  return <div>
    <h3>{editingId ? 'Edit Post' : 'Create Post'}</h3>
    <input placeholder='Title' value={title} onChange={e=>setTitle(e.target.value)}/><br/>
    <input placeholder='categories (comma separated)' value={categories} onChange={e=>setCategories(e.target.value)}/><br/>
    <input placeholder='tags (comma separated)' value={tags} onChange={e=>setTags(e.target.value)}/><br/>
    <div ref={editorRef} style={{height:200, marginBottom:10}}/>
    <button onClick={handleSubmit}>{editingId ? 'Update' : 'Publish'}</button>
    {editingId && <button onClick={()=>{setEditingId(null); setTitle(''); setCategories(''); setTags(''); quill.setText('');}}>Cancel</button>}

    <h3>Your posts</h3>
    <ul>
      {posts.map(p=> (
        <li key={p.id}>
          <strong>{p.title}</strong>
          <button onClick={()=>startEdit(p)}>Edit</button>
          <button onClick={()=>del(p.id)}>Delete</button>
        </li>
      ))}
    </ul>
  </div>;
}
