import Button from "@/components/Button";
import {getServerSession} from "next-auth";
import DeleteButton from "@/components/DeleteButton";
import React, {ChangeEvent} from "react";

export default function AuthorizedButtons(){
    function handleChange(e: ChangeEvent<HTMLInputElement>){

    }

    async function renderButtons(username: string, id: string, title: string, description: string, price: number){
        const session = await getServerSession();
        const sessionUser = JSON.parse(JSON.stringify(session)).user.name;

        if(sessionUser === username){
            return (
                <>
                    <div className={"flex w-[60%] flex-col flex-wrap sm:w-[50%] gap-5"}>
                        <input className={"text-5xl"} type="text" value={title} onChange={handleChange}></input>
                        <p className={""}>{description}</p>
                        <p>${price}</p>

                        <DeleteButton itemID={id}/>
                        <div className={"flex items-center gap-5"}>
                            <Image alt={"seller icon"} src={"/sellerIcon.svg"} width={40} height={40}/>
                            <p>Seller: {username}</p>
                        </div>

                    </div>
                </>
            )
        } else {
            return (
                <>

                    <div className={"flex w-[60%] flex-col flex-wrap sm:w-[50%] gap-5"}>
                        <p className={"text-5xl"}>{title}</p>
                        <p className={""}>{description}</p>
                        <p>${price}</p>

                        <Button type={"submit"}>Message Seller</Button>
                        <div className={"flex items-center gap-5"}>
                            <Image alt={"seller icon"} src={"/sellerIcon.svg"} width={40} height={40}/>
                            <p>Seller: {username}</p>
                        </div>

                    </div>
                </>
            )
        }
    }
    return (
        {renderButtons}
    )
}