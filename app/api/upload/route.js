import { NextResponse } from 'next/server'
import path from 'path'
import { writeFile } from 'fs/promises'
import { v4 as uuidv4 } from 'uuid'

export const dynamic = 'force-dynamic' // necessary for formData() to work

export async function POST(req) {
  const formData = await req.formData()
  const file = formData.get('file')

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const filename = `${uuidv4()}-${file.name}`
  const uploadPath = path.join(process.cwd(), 'public', 'uploads', filename)

  await writeFile(uploadPath, buffer)

  return NextResponse.json({ message: 'File uploaded successfully', filename })
}