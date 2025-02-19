'use client'
import Link from "next/link";

import Button from "@/components/Button";
import { FileUploadTest } from "@/components/FileUploadTest";
import {useEffect, useState} from "react";
import item from "../../models/Item";

export default function Home() {
    const [items, setItems] = useState([])
    useEffect(() => {
        const fetchItems = async () => {
            const res = await fetch('/api/items')
            const items = await res.json()

            if(items.status == 200){
                setItems(items.data)
            }
            else {
                console.log(items.error)
            }
        }
        fetchItems()
    }, []);
    return (
        <main>
            <div>Wpi buys</div>
{/*
            <FileUploadTest/>
*/}
            <Link href="/sell">
                <Button>Sell an Item</Button>
            </Link>
            <Link href="/profile">
                <Button>Profile</Button>
            </Link>
            <div>

                {items.map((item, index) => (
                    <div key={index}>
                        <h2>{item.title}</h2>
                        <h2>{item.description}</h2>
                        <h2>{item.category}</h2>
                        <h2>{item.price}</h2>

                    </div>

                ))}
            </div>
        </main>
    );
}
