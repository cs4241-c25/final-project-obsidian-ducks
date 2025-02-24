import Item from "@/models/Item";
import Like from "@/models/Like";
import {getServerSession} from "next-auth";


//get likes for specific user
export async function GET(request: Request){
    const session = await getServerSession()
    const sessionUser = JSON.parse(JSON.stringify(session)).user.name
    try {

        const likes = await Like.find({'username': sessionUser}).populate('itemID').exec();
       const items =  likes.map(like => like.itemID)
       console.log(items)


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

// happens when like an item
// update item likes count
export async function POST(request: Request) {
    const session = await getServerSession()
    const sessionUser = JSON.parse(JSON.stringify(session)).user.name

    try {

        //this is the item id
        let data = await request.json()
        //check if user liked item
        const check =  await Like.findOne({'itemID': data._id, 'username': sessionUser, 'isLiked': true})

        console.log(check)
        //user hasn't liked item
        if(check === null){
            const like = new Like({itemID: data._id, username: sessionUser,isLiked: true})
            const incrementLikes = await Item.updateOne({'_id': data._id} , {$inc: {'likes': 1}})
            await like.save()
        }
        //user has liked the item and is unchecking it - delete from likes
        if(check){
            const decrementLike = await Item.updateOne({'_id': data._id} , {$inc: {'likes': -1}})
            const removeLike = await Like.deleteOne({'itemID': data._id})
        }

        const item = await Item.findOne({'_id': data._id}).exec()

        console.log(item.likes)
        return new Response(
            JSON.stringify(item.likes),
            {
                status: 200,
                statusText: "OK",
                headers: {"Content-type": "application/json"}
            });    } catch (e) {
        console.error(e);
        return new Response(
            "Failed to like item",
            {
                status: 500,
                statusText: "Internal Server Error"
            }
        )
    }


}