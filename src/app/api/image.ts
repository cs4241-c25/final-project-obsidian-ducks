import { CompleteMultipartUploadCommandOutput, S3Client,} from '@aws-sdk/client-s3';
import { NextResponse } from "next/server";
import uploadFilegi from 'lib/uploadFile';


const S3 = new S3Client()

const MAX_SIZE = 5 * 1024 * 1024;
const maxImages = 4;
//todo extract all of this to a seprate function that can be called in server side files
export async function POST(req:Request) {
  const formData = await req.formData();
  const files = formData.getAll('images') as File[];
  if(files.length > maxImages) {
    return NextResponse.json({ messsage: "too many images" }, {status:400})
  }
  const uploads:Promise<CompleteMultipartUploadCommandOutput>[] = []
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  for (const file of files) {
    uploadFile(file,S3, allowedTypes, MAX_SIZE)
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
