import User from "@/models/User";
import connectToDatabase from "@/lib/db";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        await connectToDatabase();
        const user = await User.findOne({username: data}).exec();
        return new Response(
            JSON.stringify(user),
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