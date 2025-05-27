import { NextResponse } from 'next/server'
import path from 'path'
import { writeFile } from 'fs/promises'
import { v4 as uuidv4 } from 'uuid'
import fetch from 'node-fetch'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  const formData = await req.formData()
  const file = formData.get('file')

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const filename = `${uuidv4()}-${file.name}`
  const uploadPath = path.join(process.cwd(), 'public', 'uploads', filename)

  // Save file locally
  await writeFile(uploadPath, buffer)

  // Forward to OpenWebUI API
  const openwebuiFormData = new FormData()
  openwebuiFormData.append('file', new Blob([buffer]), file.name)

  const openwebuiRes = await fetch('http://localhost:3000/api/v1/files/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.BEARER_TOKEN}`,
    },
    body: openwebuiFormData,
  })

  if (!openwebuiRes.ok) {
    const errorBody = await openwebuiRes.text()
    return NextResponse.json({ error: 'Failed to upload to OpenWebUI', details: errorBody }, { status: 500 })
  }

  // Saves file ID to use for adding to collection
  const openwebuiResponseData = await openwebuiRes.json()
  const fileID = openwebuiResponseData.id

    if (!fileID) {
      return NextResponse.json({ error: 'No file ID returned from OpenWebUI' }, { status: 500 })
    }

  // Adds file ID to collection
  const knowledgeId = '11be8f2a-c02c-4301-8333-179c66eeea83' // Collection ID contained in collection URL
  const addToCollectionRes = await fetch(`http://localhost:3000/api/v1/knowledge/${knowledgeId}/file/add`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.BEARER_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ file_id: fileID }),
  })

    if (!addToCollectionRes.ok) {
    const errorBody = await addToCollectionRes.text()
    return NextResponse.json({ error: 'Failed to add file to knowledge collection', details: errorBody }, { status: 500 })
  }

  const collectionResponseData = await addToCollectionRes.json()

  // Check if sending file is successful
  console.log('OpenWebUI response:', openwebuiResponseData)

  // Returns json information regarding uploaded file
  return NextResponse.json({
    message: 'File uploaded successfully',
    filename,
    openwebuiResponse: openwebuiResponseData,
    collectionResponse: collectionResponseData,
  })
}