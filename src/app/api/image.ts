import { Upload } from "@aws-sdk/lib-storage"
import { CompleteMultipartUploadCommandOutput, S3Client,} from '@aws-sdk/client-s3';
import { NextResponse } from "next/server";


const S3 = new S3Client()

const maxSize = 5 * 1024 * 1024;
const maxImages = 4;

export async function POST(req:Request) {
  //todo see if this is nessary
  const formData = await req.formData();
  const files = formData.getAll('images') as File[];
  if(files.length > maxImages) {
    return NextResponse.json({ messsage: "too many images" }, {status:400})
  }
  const uploads:Promise<CompleteMultipartUploadCommandOutput>[] = []
  for (const file of files) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if(allowedTypes.includes(file.type) === false) {
      return NextResponse.json({ messsage: "Not an image" }, {status:400})
    }

    if(file.size > maxSize) {
      return NextResponse.json({ messsage: "Image too large" }, {status:400})
    }

    const upload = new Upload({
      params: {
          Bucket: process.env.BUCKET_NAME,
          Key: file.name, //todo should we create a hash for thsi
          Body: file,
        },
      client: S3,
      queueSize: 3,
    })
    upload.on("httpUploadProgress", (progress) => {
      console.log(progress);
    });
    uploads.push(upload.done())
  }

  try {
    const compleatedUploads = await Promise.all(uploads) // resolve all the promises
    return Response.json({
      urls:compleatedUploads.map((compleatedUpload) => {
        return `https://fly.storage.tigris.dev/${compleatedUpload.Bucket}/${compleatedUpload.Key}`
      }),
    });
  } catch {
    return NextResponse.json({ messsage: "failed to upload" }, {status:500})
  }

}
