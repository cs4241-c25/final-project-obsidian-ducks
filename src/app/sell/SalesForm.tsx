import Button from "@/components/Button";
import PhotoInput from "@/components/PhotoInput";
import TextInput from "@/components/TextInput";
import SelectInput from "@/components/SelectInput";

import { S3Client } from "@aws-sdk/client-s3";

import { itemCategories } from "@/lib/types";
import uploadFile from "@/lib/uploadFile";

export default function SalesForm() {
    // Uploads an item for sale
    async function uploadItem(formData: FormData) {
        "use server"
        // Upload photo to S3 bucket
        const s3 = new S3Client();
        const file = formData.get("image") as File;
        const allowedTypes = ["image/png", "image/jpeg", "image/gif"];
        const MAX_SIZE = 5 * 1024 * 1024;
        const result = await uploadFile(file, s3, allowedTypes, MAX_SIZE);
        if (!result.success) {
            console.error(result.message);
        }

        // Upload everything else to database
        formData.delete("image");
        console.log(Object.fromEntries(formData));

    }

    return (
        <form action={uploadItem}>
            <h1>Sell an Item</h1>
            <PhotoInput />
            <TextInput type={"text"} name={"title"} placeholder={"What are you selling?"}>Title</TextInput>
            <TextInput type={"text"} name={"description"} placeholder={"Describe your item."}>Description</TextInput>
            <SelectInput name={"category"} options={itemCategories}>Category</SelectInput>
            <TextInput type={"number"} name={"price"} placeholder={"How much are you selling it for?"}>Price</TextInput>
            <Button type={"submit"}>Submit</Button>
        </form>
    );
}