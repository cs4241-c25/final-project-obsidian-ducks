import "@/lib/db";
import uploadFile from "@/lib/uploadFile";

import Item from "@/models/Item";

import {S3Client} from "@aws-sdk/client-s3";
import Like from "@/models/Like";

/**
 * Fetches all the items being sold
 */
export async function GET(req: Request) {
    try {
        const items = await Item.find({}).exec();
        return new Response(
            JSON.stringify(items),
            {
                status: 200,
                statusText: "OK",
                headers: {"Content-type": "application/json"}
            });
    } catch (e) {
        return new Response(
            "Failed to fetch items",
            {
                status: 500,
                statusText: "Internal Server Error"
            }
        )
    }
}

/**
 * Posts a new item for sale
 */
export async function POST(request: Request) {
    const formData = await request.formData();

    // Upload image to S3 bucket
    const S3 = new S3Client();
    const file = formData.get("image") as File;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const MAX_SIZE = 5 * 1024 * 1024;
    const result = await uploadFile(file, S3, allowedTypes, MAX_SIZE);
    if (!result.success) {
        return new Response(
            result.message,
            {
                status: 400,
                statusText: "Bad request"
            }
        )
    }

    // Remove image from form data
    formData.delete("image");

    try {
        // Upload everything else to database
        const item = new Item(
            Object.fromEntries(formData.entries()) // Converts it to a JS object
        );
        item.image = result.url;
        item.likes = 0;
        const like = new Like({itemID: item._id})
        await item.save();
        await like.save()
    } catch (e) {
        console.error(e);
        return new Response(
            "Failed to upload item",
            {
                status: 500,
                statusText: "Internal Server Error"
            }
        )
    }

    return new Response(
        "Success",
        {
            status: 200,
            statusText: "OK"
        }
    )
}