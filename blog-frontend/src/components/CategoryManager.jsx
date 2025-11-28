import React, {useEffect, useState} from 'react'
import API from '../api'

export default function CategoryManager(){
  const [categories,setCategories] = useState([])
  const [name,setName] = useState('')
  const [editing,setEditing] = useState(null)

  const load = ()=> API.get('/api/categories').then(r=>setCategories(r.data)).catch(()=>{})
  useEffect(()=>{ load() },[])

  const save = async ()=>{
    try{
      if(editing) await API.put(`/api/categories/${editing.id}`, {name})
      else await API.post('/api/categories', {name})
      setName(''); setEditing(null); load()
    }catch(e){ alert('Save failed') }
  }
  const del = async id => { await API.delete(`/api/categories/${id}`); load() }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input className="flex-1 border rounded p-2" placeholder="Category name" value={name} onChange={e=>setName(e.target.value)} />
        <button onClick={save} className="px-3 py-2 bg-indigo-600 text-white rounded">{editing? 'Update' : 'Add'}</button>
      </div>
      <ul className="space-y-2">
        {categories.map(c=> (
          <li key={c.id} className="flex justify-between items-center">
            <span>{c.name}</span>
            <div className="space-x-2">
              <button onClick={()=>{setEditing(c); setName(c.name)}} className="text-sm text-blue-600">Edit</button>
              <button onClick={()=>del(c.id)} className="text-sm text-red-600">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
