import Button from "@/components/Button";
import Image from 'next/image'
<<<<<<< HEAD
import  "@/lib/db"
=======
import LikeButton from "@/components/LikeButton";
>>>>>>> main
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
            className={"flex items-center flex-wrap sm:mt-[0] sm:flex-nowrap sm:mx-auto md:w-full md:h-[calc(100vh-77px)] "}>

            <div
                className={"flex flex-col w-screen items-center justify-evenly flex-wrap md:flex-nowrap md:flex md:flex-row"}>

                <div className={"block md:flex items-center gap-10"}>
                    <div className={"relative  "}>
                        <Image className={" drop-shadow-2xl rounded-3xl"} src={item[0].image} alt={item[0].title}

                               width={400} height={300}/>
                        <LikeButton itemID={item[0]._id}/>
                    </div>


                    <div className={"flex flex-col sm:w-[50%] gap-5"}>
                        <p className={"text-5xl"}>{item[0].title}</p>
                        <p className={""}>{item[0].description}</p>
                        <p>${item[0].price}</p>

                        <Button type={"submit"}>Message Seller</Button>
                        <div className={"flex items-center gap-5"}>
                            <img alt={"seller icon"} src={"https://placehold.co/40x40"} width={40} height={40}/>
                            <p>Seller Name: Anon</p>
                        </div>

                    </div>
                    <span className={'flex self-end justify-end'}>
                            <Image src={'/tag.svg'} alt={"tag"} width={15} height={15}/>
                            <p>{item[0].category}</p>
                    </span>


                </div>
            </div>


        </main>
    )
}
