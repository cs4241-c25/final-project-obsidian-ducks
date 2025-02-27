import Item from "@/models/Item";
import Like from "@/models/Like";
import {getServerSession} from "next-auth";
import User from "@/models/User";


//get likes for specific user
export async function GET(request: Request){
    const session = await getServerSession()
    const sessionUser = JSON.parse(JSON.stringify(session)).user.name
    try {


       //figure out why there are errors??
        const user = await User.findOne({'username': sessionUser})
            .populate({
            path: 'likes',
            populate: {path: 'itemID', model: 'Item'}
        })
        const likedItems = user.likes.map(like => like.itemID);


        return new Response(
            JSON.stringify(likedItems),
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
   let itemCondition = true


    try {

        //this is the item id
        let data = await request.json()
        //check if user liked item
        const check =  await Like.findOne({'itemID': data._id, 'isLiked': true})

        const checkItemId =  await Like.findOne({'itemID': data._id})
        console.log(check)

        const likeID = checkItemId.get("_id")
        //user hasn't liked item
        if(check === null){
            const updatedLike = await Like.updateOne({'itemID': data._id} , {$set: {'isLiked': true}})
            // const incrementLikes = await Item.updateOne({'_id': data._id} , {$inc: {'likesCount': 1}})
            const userLikes = await User.updateOne({'username': sessionUser}, {$push: {'likes': likeID}})
        }
        //user has liked the item and is unchecking it - delete from likes
        if(check){
            // const decrementLike = await Item.updateOne({'_id': data._id} , {$inc: {'likesCount': -1}})
            console.log(check.get('_id'))
            const removeUserLike = await User.updateOne({'username': sessionUser}, {$pull: {'likes': check.get('_id')}})
            const updatedLike = await Like.updateOne({'itemID': data._id} , {$set: {'isLiked': false}})
            itemCondition = false
        }

        const item = await Item.findOne({'_id': data._id}).exec()

        console.log(item.likes)

        return new Response(
            JSON.stringify(itemCondition),
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