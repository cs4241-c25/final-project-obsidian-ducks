import Button from "@/components/Button";
import Image from 'next/image'
import LikeButton from "@/components/LikeButton";
async function getItem(params) {

    const {id} = await params

    if (id === undefined || id === null) {
        console.error('ID is undefined or null!');
        return;
    }
    console.log(id)
    if (id !== undefined) {
        try {
            const response = await fetch(`http://localhost:3000/api/selectedItem/${id}`, {
                method: "GET",
            });
            if (!response.ok) throw new Error(response.statusText);

            return await response.json();
        } catch (e) {
            console.log("im an eror")
            console.error(e);
            throw e;
        }
    }
}

export default async function ItemPage({params}) {
    let item = await getItem(params)
   console.log(item)

    return (

        <main
            className={"flex items-center mt-5 drop-shadow-2xl flex-wrap sm:mt-[0] sm:flex-nowrap sm:mx-auto sm:w-full sm:h-[calc(100vh-77px)] "}>

            <div
                className={"flex flex-col  w-screen items-center justify-evenly flex-wrap sm:flex-nowrap sm:flex sm:flex-row"}>

                <div className={"flex p-3 flex-col flex-wrap sm:flex-nowrap items-baseline sm:w-auto sm:flex-row sm:items-center sm:gap-10"}>
                    <div className={"relative m-9"}>
                            <Image className={"max-w-full max-h-full drop-shadow-xl rounded-3xl m-auto  "} src={item[0].image} alt={item[0].title}

                                   width={500} height={500}/>

                        <LikeButton itemID={item[0]._id}/>
                    </div>


                    <div className={"flex w-[60%] flex-col flex-wrap sm:w-[50%] gap-5"}>
                        <p className={"text-5xl"}>{item[0].title}</p>
                        <p className={""}>{item[0].description}</p>
                        <p>${item[0].price}</p>

                        <Button type={"submit"}>Message Seller</Button>
                        <div className={"flex items-center gap-5"}>
                            <Image alt={"seller icon"} src={"/sellerIcon.svg"} width={40} height={40}/>
                            <p >Seller: {item[0].username}</p>
                        </div>

                    </div>
                    <span className={'flex self-end justify-end whitespace-nowrap'}>
                            <Image src={'/tag.svg'} alt={"tag"} width={15} height={15}/>
                            <p className={"p-1 mr-5"}>{item[0].category}</p>
                    </span>


                </div>
            </div>


        </main>
    )
}