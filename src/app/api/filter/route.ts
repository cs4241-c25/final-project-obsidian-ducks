import Item from "@/models/Item";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        console.log(data);
        if(Number(data) && data.name === "min"){
            const items = await Item.find({price: { $gte: data }}).exec();
            return new Response(
                JSON.stringify(items),
                {
                    status: 200,
                    statusText: "OK",
                    headers: {"Content-type": "application/json"}
                });
        } else {
            const items = await Item.find({category: data.value}).exec();
            return new Response(
                JSON.stringify(items),
                {
                    status: 200,
                    statusText: "OK",
                    headers: {"Content-type": "application/json"}
                });
        }
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