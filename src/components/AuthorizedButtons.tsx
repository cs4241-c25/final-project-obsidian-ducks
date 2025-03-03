"use client"
import Button from "@/components/Button";
import DeleteButton from "@/components/DeleteButton";
import Image from 'next/image'
import React from "react";
import {ITEM_CATEGORIES} from "@/lib/types";

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

    async function handleForm(formData: FormData){
        const formattedData = {
            _id: props._id,
            title: String(formData.get("title")),
            description: String(formData.get("description")),
            price: Number(formData.get("price")),
            category: String(formData.get("category")),
        }
        try {
            const response = await fetch("http://localhost:3000/api/profile", {
                method: "PATCH",
                body: JSON.stringify(formattedData),
            });
            if (!response.ok) throw new Error(response.statusText);
            window.location.reload();
        } catch (e) {
            console.error(e);
        }
    }

    function renderButtons(){

        if(props.session === props.username){
            return (
                <>
                    <form action={handleForm}>
                        <div className={"flex w-[60%] flex-col flex-wrap sm:w-[50%] gap-5"}>

                            <label className="text-5xl font-extrabold">Edit Post</label>

                            <input className={"text-5xl p-2 border-1 border-gray-400 rounded-xl"} type="text"
                                   defaultValue={props.title} name="title"/>
                            <input className={"p-2 border-1 border-gray-400 rounded-xl"} type="text"
                                   defaultValue={props.description} name="description"/>
                            <input className="p-2 border-1 border-gray-400 rounded-xl" type="number" name="price"
                                   defaultValue={props.price}/>
                            <span className={'flex whitespace-nowrap'}>
                                <select className={"p-1 mr-5 border-1 border-gray-400 rounded-xl"} defaultValue={props.category}
                                        name="category">
                            {ITEM_CATEGORIES.map(option =>
                                <option key={option} value={option}>{option}</option>)}
                                    </select>
                                  <div className={"flex items-center gap-5"}>
                                <Image alt={"seller icon"} src={"/sellerIcon.svg"} width={40} height={40}/>
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

                        <Button type={"submit"}>Message Seller</Button>
                        <div className={"flex items-center gap-5"}>
                            <Image alt={"seller icon"} src={"/sellerIcon.svg"} width={40} height={40}/>
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