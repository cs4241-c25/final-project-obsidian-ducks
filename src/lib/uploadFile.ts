import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";



type uploadFileResult = {
  sucess:boolean
  url?:string
  message:string
  status:number
}

export default async function uploadFile(file: File,S3:S3Client, allowedTypes:string[],maxSize:number):Promise<uploadFileResult> {
  if(allowedTypes.includes(file.type) === false) {
    return {
      sucess:false,
      message:"file type is not allowed",
      status:400
    }
  }

  if(file.size > maxSize) {
    return {
      sucess:false,
      message:"file too large",
      status:400
    }
  }

  const upload = new Upload({
    params: {
        Bucket: process.env.BUCKET_NAME,
        Key: file.name, //todo should we create a hash for this
        Body: file,
      },
    client: S3,
    queueSize: 3,
  })
  upload.on("httpUploadProgress", (progress) => {
    console.log(progress);
  });
  const compleatedUpload = await upload.done()
  if(compleatedUpload.Bucket === undefined || compleatedUpload.Key === undefined) {
   return {
     sucess:false,
     message:"failed to create url",
     status:500
   }
  }
  return {
    sucess:true,
    url:`https://fly.storage.tigris.dev/${compleatedUpload.Bucket}/${compleatedUpload.Key}`,
    message:"sucsessfuly uploaded image",
    status:200
  }
}
