import React, {useEffect, useState} from 'react'
import API from '../api'

export default function CommentManager(){
  const [comments,setComments]=useState([])
  const [editing,setEditing]=useState(null)
  const [content,setContent]=useState('')
  useEffect(()=>{ API.get('/api/comments').then(r=>setComments(r.data)).catch(()=>{}) },[])
  const save=async()=>{ if(!editing) return; await API.put(`/api/comments/${editing.id}`, {content}); setEditing(null); setContent(''); API.get('/api/comments').then(r=>setComments(r.data)) }
  const del=async id => { await API.delete(`/api/comments/${id}`); API.get('/api/comments').then(r=>setComments(r.data)) }
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-medium mb-3">Comments</h3>
      <ul className="space-y-2">
        {comments.map(c=> (
          <li key={c.id} className="flex justify-between items-start">
            <div><strong>{c.user?.username || 'Guest'}</strong><div className="text-sm text-gray-600">{c.content}</div></div>
            <div className="space-x-2">
              <button onClick={()=>{setEditing(c); setContent(c.content)}} className="text-sm text-blue-600">Edit</button>
              <button onClick={()=>del(c.id)} className="text-sm text-red-600">Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {editing && (
        <div className="mt-4">
          <h4 className="font-medium">Edit Comment</h4>
          <textarea className="w-full border rounded p-2" value={content} onChange={e=>setContent(e.target.value)} />
          <div className="mt-2">
            <button onClick={save} className="px-3 py-2 bg-green-600 text-white rounded">Save</button>
            <button onClick={()=>{setEditing(null); setContent('')}} className="ml-2 px-3 py-2 bg-gray-200 rounded">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
