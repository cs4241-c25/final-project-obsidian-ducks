import { S3Client } from "@aws-sdk/client-s3";
import uploadFile from "lib/uploadFile";
const MAX_SIZE = 5 * 1024 * 1024;

export function FileUploadTest() {
  async function uploadFileAction(form:FormData) {
    "use server"
    const file = form.get('image') as File;
    const S3 = new S3Client()

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

    const fileUploadResult = await uploadFile(file, S3, allowedTypes, MAX_SIZE);
    if(fileUploadResult.success === false || fileUploadResult.url === undefined) {
      return
    }
    console.log(fileUploadResult)
  }

  return (
    <div>
      <form action={uploadFileAction}>

        <input name="image" type={"file"}/>
        <button type="submit">Upload image</button>
      </form>
    </div>
  )
}
