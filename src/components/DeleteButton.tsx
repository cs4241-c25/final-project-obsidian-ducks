"use client"

import Button from "@/components/Button";
import {useRouter} from "next/navigation";

interface  DeleteButton {
    itemID: string
}

async function deletePost(id: string){
    try {
        const response = await fetch(`http://localhost:3000/api/profile`, {
            method: "DELETE",
            body: JSON.stringify(id),
        });
        if (!response.ok) throw new Error(response.statusText);
    } catch (e) {
        console.log("im an eror")
        console.error(e);
        throw e;
    }
}


export default function DeleteButton(props: DeleteButton){
    const router = useRouter();

    async function handleDelete() {
        await deletePost(props.itemID);
        router.push('/profile');
    }

    return (
        <Button type="button" onClick={handleDelete}>Delete Post</Button>
    )
}