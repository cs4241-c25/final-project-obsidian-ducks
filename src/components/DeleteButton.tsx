"use client"

import Button from "@/components/Button";

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
        return await response.json();
    } catch (e) {
        console.log("im an eror")
        console.error(e);
        throw e;
    }
}


export default function DeleteButton(props: DeleteButton){

    async function handleDelete() {
        await deletePost(props.itemID);
    }

    return (
        <Button type="button" onClick={handleDelete}>Delete Post</Button>
    )
}