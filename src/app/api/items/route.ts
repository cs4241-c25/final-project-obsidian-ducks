import { connectToDatabase } from "@/lib/db";

import Item from "@/models/Item";
import {NextResponse} from "next/server";
import {S3Client} from "@aws-sdk/client-s3";
import uploadFile from "@/lib/uploadFile";

// /**
//  * Retrieves all the items being sold
//  */
// export async function GET(req: Request){
//     await connectToDatabase()
//     try {
//         const items = await Item.find({});
//         return new Response(JSON.stringify({status: 200, data: items}), {
//
//             headers: {'Content-type': 'application/json'}
//         })
//
//     }
//     catch (error){
//         console.log("failled")
//         return new Response(JSON.stringify({message: "failed"}),{
//                 status: 400,
//             }
//
//         )
//     }
// }

/**
 * Posts a new item for sale
 */
export async function POST(request: Request){
    await connectToDatabase();
    const formData = await request.formData();

    // Upload image to S3 bucket
    const S3 = new S3Client();
    const file = formData.get("image") as File;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const MAX_SIZE = 5 * 1024 * 1024;
    const result = await uploadFile(file, S3, allowedTypes, MAX_SIZE);
    console.log(result);

    // Remove image from form data
    formData.delete("image");

    // Upload everything else to database
    const item = new Item(
        Object.fromEntries(formData.entries()) // Converts it to a JS object
    );
    await item.save();

    return Response.json({
        message: "success"
    });
}