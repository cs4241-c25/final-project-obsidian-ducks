import {connectToDatabase} from "../../../lib/db";
import Item from '../../../../models/Item'

export async function GET(req: Request){
    await connectToDatabase()
    try {
        const items = await Item.find({});
        return new Response(JSON.stringify({status: 200, data: items}), {

            headers: {'Content-type': 'application/json'}
        })

    }
    catch (error){
        console.log("failled")
        return new Response(JSON.stringify({message: "failed"}),{
                status: 400,
            }

        )
    }
}
export async function POST(req: Request){
    await connectToDatabase()

   // console.log(req)
    try {
        const data = await req.json()
        console.log(data)
        const item = await Item.create(data);
        return new Response(JSON.stringify({data: item}), {
            status: 200,
            headers: {'Content-type': 'application/json'}
        })


    }
    catch (error){
        console.log("failled")
        return new Response(JSON.stringify({message: "failed"}),{
                status: 400,
        }

    )
    }

}

