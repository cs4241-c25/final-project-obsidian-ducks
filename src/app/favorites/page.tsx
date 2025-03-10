'use client'
import React, {useEffect, useState} from "react";
import ItemPost from "../ItemPost";
import FavoritePost from "../../components/FavoritePost"
export default function Favorites() {
    const [likes, setLikes] = useState([]);
    const [likeCount, setLikeCount] = useState(0)
    const removeFavorite = (itemID: string) => {
        // Update the likes array by filtering out the item that was removed
        setLikes(likes.filter(item => item._id !== itemID));
        setLikeCount(likeCount - 1)
    };
    async function getLikes() {
        try {
            const response = await fetch("/api/likes", {
                method: "GET",
            });
            if (!response.ok) throw new Error(response.statusText);
            const data = await response.json()
            setLikes(data);
            //return likes
            console.log(data)
            setLikeCount(data.length)

        } catch (e) {
            console.error(e);
            throw e;
        }
    }
    useEffect(() => {
        getLikes().then();
    }, [])



    return (
        <div className={"flex justify-center"}>

            <div className={"flex-col w-3/4 justify-center"}>
                <div className={"flex-col justify-center text-left flex-wrap"}>
                    <h1 className={"text-4xl mt-5 font-bold text-center"}>Your Favorites</h1>
                    <h2 className={"font-bold ml-2 mb-5"}>Likes: {likeCount}</h2>
                </div>

                <div className={"flex justify-center flex-wrap  gap-9"}>
                    {likes.map(item => (
                        <FavoritePost key={item._id} id={item._id} title={item.title} description={item.description}
                                  category={item.category}
                               onRemove={() => removeFavorite(item._id)}   price={item.price} image={item.image}/>
                    ))
                    }
                </div>
            </div>

        </div>
    )
}


