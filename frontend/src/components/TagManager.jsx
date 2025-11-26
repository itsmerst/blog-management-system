import React, {useEffect, useState} from 'react';
import { apiFetch } from '../api';

export default function TagManager() {
  const [tags, setTags] = useState([]);
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(null);

  const load = () => {
    apiFetch('/api/tags', {method:'GET'}).then(r=>r.json()).then(setTags).catch(()=>{});
  };
  useEffect(() => { load(); },[]);

  const save = async () => {
    if(editing) {
      const res = await apiFetch('/api/tags/' + editing.id, {
        method:'PUT',
        body: JSON.stringify({name})
      });
      if(res.ok) { setName(''); setEditing(null); load(); }
    } else {
      const res = await apiFetch('/api/tags', {
        method:'POST',
        body: JSON.stringify({name})
      });
      if(res.ok) { setName(''); load(); }
    }
  };

  const del = async (id) => {
    const res = await apiFetch('/api/tags/' + id, {method:'DELETE'});
    if(res.ok) load();
  };

  return <div>
    <h3>Tags</h3>
    <input placeholder='Tag name' value={name} onChange={e=>setName(e.target.value)}/>
    <button onClick={save}>{editing ? 'Update' : 'Add'}</button>
    {editing && <button onClick={()=>{setEditing(null); setName('');}}>Cancel</button>}
    <ul>
      {tags.map(t=>(
        <li key={t.id}>
          {t.name}
          <button onClick={()=>{setEditing(t); setName(t.name);}}>Edit</button>
          <button onClick={()=>del(t.id)}>Delete</button>
        </li>
      ))}
    </ul>
  </div>;
}
