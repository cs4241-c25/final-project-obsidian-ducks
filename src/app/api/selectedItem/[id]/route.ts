import Item from "@/models/Item";
import PostInput from "@/components/ItemPost"

/*Get single item for listing page*/
export async function GET(req: Request) {
    const url = new URL(req.url)
    try {
        const id = url.pathname.split('/').pop()
        console.log(url)
        console.log(id)
        const item = await Item.find({'_id': id}).exec();

        console.log(item)
        return new Response(
            JSON.stringify(item),
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