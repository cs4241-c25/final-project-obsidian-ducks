import { S3Client,} from '@aws-sdk/client-s3';
import { NextResponse } from "next/server";
import uploadFile from 'lib/uploadFile';



const MAX_SIZE = 5 * 1024 * 1024;
const maxImages = 4;
//todo extract all of this to a seprate function that can be called in server side files
export async function POST(req:Request) {
  const S3 = new S3Client()
  const formData = await req.formData();
  const files = formData.getAll('images') as File[];
  if(files.length > maxImages) {
    return NextResponse.json({ messsage: "too many images" }, {status:400})
  }
  const urls:string[] = []
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  for (const file of files) {
    try {
      const urlResult = await uploadFile(file, S3, allowedTypes, MAX_SIZE);
      if(urlResult.success === false || urlResult.url === undefined) {
        return NextResponse.json({ message: urlResult.message }, {status:urlResult.status})
      }

      urls.push(urlResult.url)

    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json({ messsage:"somthing went wrong plese try again later" }, {status:500})
      }
    }
  }
  return NextResponse.json({
    messsage:"Sucessfuly uploaded images",
    urls:urls
  }, {status:500})
}
