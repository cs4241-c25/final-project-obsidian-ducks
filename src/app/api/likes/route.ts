import {S3Client} from "@aws-sdk/client-s3";
import uploadFile from "@/lib/uploadFile";
import Item from "@/models/Item";
import Like from "@/models/Like";


// happens when like an item
// update item likes count
export async function POST(request: Request) {


    try {

        // Upload everything else to database
        console.log(request.body)
        //const item = Item.find({'itemID': request.body})
        //const likes = JSON.parse(JSON.stringify(item)).likes

        //const update = await Item.updateOne({'itemID': request.body} , {$pull: {'likes': likes + 1}})

        //const like = new Like({itemID: item._id})

      //  console.log(update)
        return new Response(
            JSON.stringify(request.body),
            {
                status: 200,
                statusText: "OK",
                headers: {"Content-type": "application/json"}
            });    } catch (e) {
        console.error(e);
        return new Response(
            "Failed to upload item",
            {
                status: 500,
                statusText: "Internal Server Error"
            }
        )
    }


}