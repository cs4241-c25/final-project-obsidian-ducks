import { Oswald } from "next/font/google";

import ItemPosts from "@/components/ItemPosts";

import Item from "@/models/Item";

import "@/lib/db";

const oswald = Oswald({
    subsets: ["latin"]
});


export default async function Home() {
    let items = await Item.find({}).exec();
    items = items.map(item => ({
        id: item._id.toString(),
        title: item.title,
        price: item.price,
        category: item.category,
        description: item.description,
        image: item.image
    }));


    return (
        <main className="overflow-x-hidden">
            <section className="w-screen relative mb-8">
                <div className="absolute w-full h-full bg-linear-to-r from-crimson-500 to-crimson-500 opacity-50"></div>
                <img className="w-full" src="/WPI.png" alt="WPI campus"/>
                <div className="absolute top-0 left-0 w-45/100 h-full flex justify-center items-center">
                    <p className={`${oswald.className} inline text-center text-white opacity-95 
                    md:font-medium lg:font-semibold 
                    text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 
                    tracking-wider lg:tracking-widest xl:tracking-[0.15em] 2xl:tracking-[0.2em]
                    leading-[30px] md:leading-[45px] xl:leading-[55px] 2xl:leading-[75px] 
                    `}>
                        Sell, Buy, and Swap<br/>
                        Secondhand Items with<br/>
                        Fellow WPI Students
                    </p>
                </div>
            </section>
            <ItemPosts items={items}/>
        </main>
    );
}

