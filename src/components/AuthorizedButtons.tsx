"use client"
import Button from "@/components/Button";
import DeleteButton from "@/components/DeleteButton";
import Image from 'next/image'
import React, {ChangeEvent} from "react";

interface AuthorizedButtons {
    username: string,
    id: string,
    title: string,
    description: string,
    price: number,
    session: string,
    category: string,
}

export default function AuthorizedButtons(props: AuthorizedButtons){
    function handleChange(e: ChangeEvent<HTMLInputElement>){

    }

    function renderButtons(){

        if(props.session === props.username){
            return (
                <>
                    <div className={"flex w-[60%] flex-col flex-wrap sm:w-[50%] gap-5"}>
                        <input className={"text-5xl p-1 border-1 border-gray-400 rounded-xl"} type="text"
                               value={props.title} onChange={handleChange}/>
                        <input className={"p-1 border-1 border-gray-400 rounded-xl"} type="text"
                               value={props.description} onChange={handleChange}/>
                        <input className="p-1 border-1 border-gray-400 rounded-xl" type="number" value={props.price}
                               onChange={handleChange}/>

                        <DeleteButton itemID={props.id}/>
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