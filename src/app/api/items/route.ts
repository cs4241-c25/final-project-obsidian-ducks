import { connectToDatabase } from "@/lib/db";

import Item from "@/models/Item";
import {NextResponse} from "next/server";

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
    const formData = await request.formData();
    const title = formData.get("title");
    console.log(title);
    return Response.json({message: "OK"});

    // try {
    //     const data = await req.json()
    //     console.log(data)
    //     const item = await Item.create(data);
    //     return new Response(JSON.stringify({data: item}), {
    //         status: 200,
    //         headers: {'Content-type': 'application/json'}
    //     })
    //
    //
    // }
    // catch (error){
    //     console.log("failled")
    //     return new Response(JSON.stringify({message: "failed"}),{
    //             status: 400,
    //         }
    //
    //     )
    // }
}