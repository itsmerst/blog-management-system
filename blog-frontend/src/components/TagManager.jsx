import React, {useEffect, useState} from 'react'
import API from '../api'

export default function TagManager(){
  const [tags,setTags]=useState([])
  const [name,setName]=useState('')
  const [editing,setEditing]=useState(null)
  useEffect(()=>{ API.get('/api/tags').then(r=>setTags(r.data)).catch(()=>{}) },[])
  const save=async()=>{ if(editing) await API.put(`/api/tags/${editing.id}`,{name}) ; else await API.post('/api/tags',{name}); setName(''); setEditing(null); API.get('/api/tags').then(r=>setTags(r.data)) }
  const del=async id => { await API.delete(`/api/tags/${id}`); API.get('/api/tags').then(r=>setTags(r.data)) }
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input className="flex-1 border rounded p-2" placeholder="Tag name" value={name} onChange={e=>setName(e.target.value)} />
        <button onClick={save} className="px-3 py-2 bg-indigo-600 text-white rounded">{editing? 'Update' : 'Add'}</button>
      </div>
      <ul className="space-y-2">
        {tags.map(t=> (
          <li key={t.id} className="flex justify-between items-center">
            <span>{t.name}</span>
            <div className="space-x-2">
              <button onClick={()=>{setEditing(t); setName(t.name)}} className="text-sm text-blue-600">Edit</button>
              <button onClick={()=>del(t.id)} className="text-sm text-red-600">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
