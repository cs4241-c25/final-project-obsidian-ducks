"use client";

import { useState } from "react";

import ItemPost from "@/components/ItemPost";

import { Item } from "@/lib/types";

interface ItemPosts {
    items: Item[];
}

export default function ItemPosts(props: ItemPosts) {
    const [items, setItems] = useState(props.items);

    return (
        <section className="flex justify-center">
            <div className="w-3/4 flex flex-wrap gap-9.5">
                {props.items.map((item) =>
                    <ItemPost key={item._id} id={item._id} title={item.title} category={item.category} price={item.price} image={item.image}/>)}
            </div>
        </section>
    );
}