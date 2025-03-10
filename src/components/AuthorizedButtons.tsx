"use client"
import Button from "@/components/Button";
import DeleteButton from "@/components/DeleteButton";
import Image from 'next/image'
import React from "react";
import {ChatRoom, ITEM_CATEGORIES} from "@/lib/types";
import { redirect } from "next/navigation";
import { useWebSocket } from "./chat/ChatContext";
import {useEffect, useState} from "react";

interface AuthorizedButtons {
    username: string,
    _id: string,
    title: string,
    description: string,
    price: number,
    session: string,
    category: string,
}

export default function AuthorizedButtons(props: AuthorizedButtons){
    const chatManager = useWebSocket()
    const [profilePicture, setProfilePicture] = useState<string>("/blank.svg");

    useEffect(() => {
        async function fetchProfilePicture() {
            try {
                const response = await fetch("/api/image", {
                    method: "POST",
                    body: JSON.stringify(props.username),
                });
                if (!response.ok) throw new Error(response.statusText);
                const data = await response.json();
                setProfilePicture(data.profileImage || "/blank.svg");
            } catch (e) {
                console.error(e);
            }
        }

        fetchProfilePicture();
    }, [props.username]);
    async function handleForm(formData: FormData){
        const formattedData = {
            _id: props._id,
            title: String(formData.get("title")),
            description: String(formData.get("description")),
            price: Number(formData.get("price")),
            category: String(formData.get("category")),
        }
        try {
            const response = await fetch("/api/profile", {
                method: "PATCH",
                body: JSON.stringify(formattedData),
            });
            if (!response.ok) throw new Error(response.statusText);
            window.location.reload();
        } catch (e) {
            console.error(e);
        }
    }

    async function createChatRoom() {
      if(props.session === "") {
        return
      }
      const response = await fetch("/api/chats",{
        method:"POST",
        body: JSON.stringify({
          chatters:[props.username,props.session]
        })
      })
      const newChatRoom:ChatRoom = await response.json()
      if(chatManager.chats.find((chat) =>  chat.chat_id===newChatRoom.chat_id) === undefined) {
        chatManager.setChats([newChatRoom,...chatManager.chats])
      }
      redirect(`/chats/${newChatRoom.chat_id}`)
    }


    function renderButtons(){

        if(props.session === props.username){
            return (
                <>
                    <form action={handleForm}>
                        <div className={"flex w-[60%] flex-col flex-wrap sm:w-[50%] gap-5"}>

                            <label className="text-3xl md:text-5xl font-extrabold">Edit Post</label>

                            <input className={"text-xl md:text-5xl p-2 border-1 border-gray-400 rounded-xl"} type="text"
                                   defaultValue={props.title} name="title"/>
                            <input className={"p-2 border-1 border-gray-400 rounded-xl"} type="text"
                                   defaultValue={props.description} name="description"/>
                            <input className="p-2 border-1 border-gray-400 rounded-xl" type="number" name="price"
                                   defaultValue={props.price}/>
                            <span className={'flex flex-col md:flex-row md:whitespace-nowrap'}>
                                <select className={"p-1 mr-5 border-1 border-gray-400 rounded-xl"} defaultValue={props.category}
                                        name="category">
                            {ITEM_CATEGORIES.map(option =>
                                <option key={option} value={option}>{option}</option>)}
                                    </select>
                                <div className={"flex items-center gap-5 pt-4 md:pt-0"}>
                                    <div className="w-[60px] h-[60px] rounded-full overflow-hidden">
                                        <Image alt={"seller icon"} src={profilePicture} width={60} height={60} priority={true} className="w-full h-full object-cover"/>
                                    </div>
                                    <p>Seller: {props.username}</p>
                                </div>
                        </span>
                            <div className="flex gap-x-4">
                                <DeleteButton itemID={props._id}/>
                                <Button type={"submit"}>Update Post</Button>
                            </div>
                        </div>
                    </form>
                </>
            )
        } else {
            return (
                <>

                    <div className={"flex w-[60%] flex-col flex-wrap sm:w-[50%] gap-5"}>
                    <p className={"text-5xl"}>{props.title}</p>
                        <p className={""}>{props.description}</p>
                        <p>${props.price}</p>
                        { props.session !== "" ?
                          <Button onClick={() => { createChatRoom().then() } }  type={"submit"}>Message Seller</Button>
                          : <></>
                        }

                        <div className={"flex items-center gap-5"}>
                            <div className= "w-[90px] h-[90px] rounded-full overflow-hidden">
                                <Image alt={"seller icon"} src={profilePicture} width={90} height={90} priority={true} className="w-full h-full object-cover"/>
                            </div>
                                <p>Seller: {props.username}</p>
                        </div>
                    </div>
                    <span className={'flex self-end justify-end whitespace-nowrap'}>
                            <Image src={'/tag.svg'} alt={"tag"} width={15} height={15}/>
                            <p className={"p-1 mr-5"}>{props.category}</p>
                    </span>
                </>
            )
        }
    }

    return (
        <div>
            {renderButtons()}
        </div>
    )
}
