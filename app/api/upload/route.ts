import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file = data.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' }, { status: 400 })
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size too large. Maximum 5MB allowed.' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    // Attempt local filesystem storage with serverless (Vercel) fallback
    try {
      const uploadDir = join(process.cwd(), 'public', 'images', 'uploads')
      try {
        await mkdir(uploadDir, { recursive: true })
      } catch (err) {
        // Directory might already exist
      }

      const filepath = join(uploadDir, filename)
      await writeFile(filepath, buffer)

      const url = `/images/uploads/${filename}`
      return NextResponse.json({ url, filename })
    } catch (fsError) {
      console.warn('Local filesystem write failed (read-only environment detected). Using Data URL fallback.')
      const base64Data = buffer.toString('base64')
      const dataUrl = `data:${file.type};base64,${base64Data}`
      return NextResponse.json({ url: dataUrl, filename })
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}
