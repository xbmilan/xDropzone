// Relevant imports
//import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { PutObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { NextRequest, NextResponse } from "next/server"

interface S3ClientType  {
  region : string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string
  }}

// Initialize S3Client instance
const client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
} as S3ClientType)

const POST = async (req: NextRequest) => {
  try {
    // const user = await currentUser()
    // if (!user) return new Response('Unauthorized', { status: 401 })

    const { fileName, fileType, fileSize } = await req.json()
    if (!fileType || !fileName || !fileSize) {
      throw new Error("There was a problem with the file!")
    }

    // Create a new media entry in database.
    // The uploaded media file will be stored in the S3 bucket 
    // with a name (Key) matching the id (PK) of the newMedia/photo. 

    // const newMedia: Photo = await prisma.photo.create({
    //   data: {
    //     fileSize: fileSize,
    //     fileName: fileName,
    //     mimeType: fileType,
    //     // authorId: user.id,
    //     // authorName: `${user.firstName} ${user.lastName}`
    //   }
    // })

    // if (!newMedia) { throw new Error("Something went wrong!") }

    // PutObjectCommand: used to generate a pre-signed URL for uploading
    const putCommand = new PutObjectCommand({
      Key: fileName,
      ContentType: fileType,
      Bucket: process.env.AWS_BUCKET_NAME,
    })
    // Generate pre-signed URL for PUT request
    const putUrl = await getSignedUrl(client, putCommand, { expiresIn: 600 })

    // GetObjectCommand: used to generate a pre-signed URL for viewing.
    const getCommand = new GetObjectCommand({
      Key: fileName,
      Bucket: process.env.AWS_BUCKET_NAME,
    })
    // Generate pre-signed URL for GET request
    const getUrl = await getSignedUrl(client, getCommand, { expiresIn: 600 })

    return NextResponse.json({ putUrl, getUrl }, { status: 200 })
  } catch (error) {
    console.log(error)
    throw error
  }
}

export {
  POST,
}