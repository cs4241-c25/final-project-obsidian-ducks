import {S3Client} from "@aws-sdk/client-s3";
import uploadFile from "@/lib/uploadFile";
import User from "@/models/User";
import Item from "@/models/Item";

/**
 * Posts a profile picture
 */
export async function POST(request: Request) {
    const formData = await request.formData();
    console.log("This is form data ", formData);
    // Upload image to S3 bucket
    const sessionUser = formData.get("username") as String
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
        const user = new User(
            Object.fromEntries(formData.entries()) // Converts it to a JS object
        );
        await User.updateOne({'username': sessionUser} ,{$set : {'profileImage': result.url}})
        await user.save();
        user.profileImage = result.url;
        console.log("This is user ", user);
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

export async function DELETE(req: Request) {
    try {
        const data = await req.json();
        const items = await Item.deleteOne({_id: data}).exec();
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