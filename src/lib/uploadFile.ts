import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

export default async function uploadFile(file: File,S3:S3Client, allowedTypes:string[],maxSize:number) {
  if(allowedTypes.includes(file.type) === false) {
    throw Error("invalid file type")
  }

  if(file.size > maxSize) {
    throw new Error(" file too large ")
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
  const compleatedUpload = await upload.done()
  if(compleatedUpload.Bucket === undefined || compleatedUpload.Key === undefined) {
    throw new Error("failed generate url for file")
  }
  return `https://fly.storage.tigris.dev/${compleatedUpload.Bucket}/${compleatedUpload.Key}`
}
