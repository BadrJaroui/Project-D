'use client'

import { useState } from 'react'

export default function FileUploader() {
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
          Authorization: 'Bearer YOUR_API_KEY',
        },
        body: formData,
      })

      const data = await res.json()
      setStatus(`Success: ${JSON.stringify(data)}`)
    } catch (err) {
      console.error(err)
      setStatus('Error uploading file')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-2"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Upload
      </button>
      {status && <p className="mt-2">{status}</p>}
    </form>
  )
}