'use client'
import React, {useEffect, useState} from "react";
import Post from "@/components/Post";

export default function Favorites() {
    const [likes, setLikes] = useState([]);

    async function getLikes() {
        try {
            const response = await fetch("http://localhost:3000/api/likes", {
                method: "GET",
            });
            if (!response.ok) throw new Error(response.statusText);
            const data = await response.json()
            setLikes(data);
            //return likes
            console.log(data)

        } catch (e) {
            console.error(e);
            throw e;
        }
    }
    useEffect(() => {
        getLikes().then();
    }, [])
    return (
        <div className={"flex"}>
            {likes.map(item => (
                <Post key={item._id} _id={item._id} title={item.title} description={item.description} category={item.category}
                      price={item.price} image={item.image}/>
                ))

            }
        </div>
    )
}


