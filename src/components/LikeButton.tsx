'use client'
import Button from "@/components/Button";
import React, {useState} from "react";
import {useSession} from "next-auth/react";
import {red} from "next/dist/lib/picocolors";

interface  ItemID {
    itemID: string
}
export default function LikeButton(props: ItemID) {
    const [fillClass, setFillClass] = useState("white")
    const {data: session} = useSession()
    const usernameSession = session?.user?.name
    async function handleLikes(itemID: string) {

        if(fillClass === "white"){
            setFillClass("red")
        }
        if(fillClass === "red"){
            setFillClass("white")
        }

        let data = {
            _id: itemID,
            username: usernameSession

        }
        try {
            const response = await fetch("http://localhost:3000/api/likes", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {'Content-type': 'application/json'}

            });
            const test = await response

        } catch (e) {
            console.error(e);
        }
    }
    return <Button onClick={() => handleLikes(props.itemID)} className={"absolute top-2 right-2 z-10 p-2 rounded-full shadow-md bg-white hover:bg-white"}  type="button">

        <svg  width="15" height="15" viewBox="0 0 24 24" fill={fillClass} xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                  stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

    </Button>
}