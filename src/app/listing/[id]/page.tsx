import Button from "@/components/Button";


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
                className={"flex flex-col w-screen items-center item-center justify-evenly flex-wrap md:flex-nowrap md: flex md:flex-row"}>

                <div className={"block  md:flex items-center gap-10"}>
                    <img alt="placeholder" src={`${item[0].image}`} width={500} height={400}></img>

                    <div className={"flex flex-col sm:w-[50%] gap-5"}>
                        <p>${item[0].price}</p>
                        <p className={""}>{item[0].description}</p>
                        <Button type={"submit"}>Message Seller</Button>
                        <div className={"flex items-center gap-5"}>
                            <img alt={"seller icon"} src={"https://placehold.co/40x40"} width={40} height={40}/>
                            <p>Seller Name: Anon</p>
                        </div>

                    </div>


                </div>
            </div>


        </main>
    )
}