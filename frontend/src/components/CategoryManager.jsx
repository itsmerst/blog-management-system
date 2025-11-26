import React, {useEffect, useState} from 'react';
import { apiFetch } from '../api';

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(null);

  const load = () => {
    apiFetch('/api/categories', {method:'GET'}).then(r=>r.json()).then(setCategories).catch(()=>{});
  };
  useEffect(() => { load(); },[]);

  const save = async () => {
    if(editing) {
      const res = await apiFetch('/api/categories/' + editing.id, {
        method:'PUT',
        body: JSON.stringify({name})
      });
      if(res.ok) { setName(''); setEditing(null); load(); }
    } else {
      const res = await apiFetch('/api/categories', {
        method:'POST',
        body: JSON.stringify({name})
      });
      if(res.ok) { setName(''); load(); }
    }
  };

  const del = async (id) => {
    const res = await apiFetch('/api/categories/' + id, {method:'DELETE'});
    if(res.ok) load();
  };

  return <div>
    <h3>Categories</h3>
    <input placeholder='Category name' value={name} onChange={e=>setName(e.target.value)}/>
    <button onClick={save}>{editing ? 'Update' : 'Add'}</button>
    {editing && <button onClick={()=>{setEditing(null); setName('');}}>Cancel</button>}
    <ul>
      {categories.map(c=>(
        <li key={c.id}>
          {c.name}
          <button onClick={()=>{setEditing(c); setName(c.name);}}>Edit</button>
          <button onClick={()=>del(c.id)}>Delete</button>
        </li>
      ))}
    </ul>
  </div>;
}
