import Item from "@/models/Item";
import User from "@/models/User";
import Like from "@/models/Like";

export async function POST(req: Request) {
    try {
        //Getting user
        const data = await req.json();
        const user = await User.findOne({username: data}, {likes: 1, _id: 0});
        //Getting just the like ids from same user
        const likeItems = await Like.find({_id: user.likes});
        const likeItemsIDs = likeItems.map(ids => ids.itemID);
        //Compare item ids to the array of like.itemIDs
        const items = await Item.find({_id: {$in: likeItemsIDs}});
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

export async function DELETE(req: Request) {
    try {
        const data = await req.json();
        console.log(data);
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