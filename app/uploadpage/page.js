'use client'

import { useState } from 'react'
import TopBanner from '../components/TopBanner'


//using export default so that you cam import into other files
export default function FileUploader() {
    //saves usestates
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
        },
        body: formData,
      })

      const data = await res.json() 
      setStatus(`File successfully added`)
      e.target.reset();
      setFile(null);
    } catch (err) {
      console.error(err)
      setStatus('Error uploading file')
    }
  }

  return (

    <div className="min-h-screen flex flex-col">
       <TopBanner/>
       
        <div className="flex-1 flex items-center justify-center">
            
        <div className="p-11 rounded-2xl bg-white">
        <div className="flex text-black font-semibold justify-left">
          Upload files (PDF)
        </div>
        
        <form onSubmit={handleSubmit} className="flex items-center space-x-4 p-4 ">
  
        <label className=" cursor-pointer bg-[#f15a22] hover:bg-blue-500 text-white px-8 py-4 rounded-2xl">
          Select file
          <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden"
          />  
        </label>

        <button type="submit" className="flex bg-[#f15a22] hover:bg-blue-500 text-white px-8 py-4 rounded-2xl justify-center">
          Upload
         </button>
         
        </form>
        {file && (<p className="p-2 text-black rounded-2xl font-semibold border border-black/50 shadow-inner mt-1">Selected file: <span >{file.name}</span> </p>)} 
        {status && <p className="p-2 text-black rounded-2xl font-semibold border border-black/50 shadow-inner mt-1">{status}</p>}   
        
  
      </div>
       </div>
    </div>
      
 
  )
  
}