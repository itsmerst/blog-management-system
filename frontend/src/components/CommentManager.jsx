import React, {useEffect, useState} from 'react';
import { apiFetch } from '../api';

export default function CommentManager() {
  const [comments, setComments] = useState([]);
  const [editing, setEditing] = useState(null);
  const [content, setContent] = useState('');

  const load = () => {
    apiFetch('/api/comments', {method:'GET'}).then(r=>r.json()).then(setComments).catch(()=>{});
  };
  useEffect(() => { load(); },[]);

  const save = async () => {
    if(!editing) return;
    const res = await apiFetch('/api/comments/' + editing.id, {
      method:'PUT',
      body: JSON.stringify({content, approved: editing.approved})
    });
    if(res.ok) { setEditing(null); setContent(''); load(); }
  };

  const del = async (id) => {
    const res = await apiFetch('/api/comments/' + id, {method:'DELETE'});
    if(res.ok) load();
  };

  return <div>
    <h3>Comments</h3>
    <ul>
      {comments.map(c=>(
        <li key={c.id}>
          {(c.user && c.user.username) || 'Guest'}: {c.content}
          <button onClick={()=>{setEditing(c); setContent(c.content);}}>Edit</button>
          <button onClick={()=>del(c.id)}>Delete</button>
        </li>
      ))}
    </ul>
    {editing && (
      <div>
        <h4>Edit Comment</h4>
        <textarea value={content} onChange={e=>setContent(e.target.value)}/>
        <br/>
        <button onClick={save}>Save</button>
        <button onClick={()=>{setEditing(null); setContent('');}}>Cancel</button>
      </div>
    )}
  </div>;
}
