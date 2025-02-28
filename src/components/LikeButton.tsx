'use client'
import Button from "@/components/Button";
import React, {useState} from "react";
import {useSession} from "next-auth/react";

interface  ItemID {
    itemID: string
}
export default function LikeButton(props: ItemID) {
    const [buttonClass, setButtonClass] = useState("absolute top-2 right-2 z-10 p-2 rounded-full shadow-md bg-white hover:bg-red-800")
    const {data: session} = useSession()
    const usernameSession = session?.user?.name
    async function handleLikes(itemID: string) {


        if (!buttonClass.includes("bg-white")){
            setButtonClass("absolute top-2 right-2 z-10 p-2 rounded-full shadow-md bg-white hover:bg-red-800")
        }
        if(buttonClass.includes("bg-white")){
            setButtonClass("absolute top-2 right-2 z-10 p-2 rounded-full shadow-md bg-red-800 hover:bg-red-800")
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
    return <Button type="button" className={buttonClass} onClick={ () => handleLikes(props.itemID)}>
        <img src="/like.svg" alt="Heart Image" width={15} height={15}/>
    </Button>;
}