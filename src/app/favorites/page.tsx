'use client'
import React, {useEffect, useState} from "react";
import ItemPost from "../ItemPost";
import FavoritePost from "../../components/FavoritePost"
export default function Favorites() {
    const [likes, setLikes] = useState([]);
    const [likeCount, setLikeCount] = useState(0)
    const [style, setStyle] = useState({
        overflow: "hidden",
        height: "65vh"
    })
    const [seeLess,setSeeLess] = useState({
        display: "none"
    })
    const [seeMore,setSeeMore] = useState({
        display: "block"
    })
    function handleSeeMore() {
        setStyle({
            overflow: "visible",
            height: "100vh"

        })
        setSeeMore({
            display: "none"
        })
        setSeeLess({
            display: "block"
        })
    }
    function handleSeeLess() {
        if(style.overflow === "visible"){
             setStyle({
                overflow: "hidden",
                height: "65vh"
            })

        }
        setSeeLess({
            display: "none"
        })
        setSeeMore({
            display: "block"
        })
    }
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
        {/*    <p style={seeLess} onClick={() => handleSeeLess()}
               className={"text-right m-5 cursor-pointer hover:font-bold"}>See Less</p>*/}
            <div className={"flex-col w-3/4 justify-center"}>
                <div className={"flex-col justify-center text-left flex-wrap"}>
                    <h1 className={"text-4xl mt-5 font-bold text-center"}>Your Favorites</h1>
                    <h2 className={"font-bold ml-2 mb-5"}>Likes: {likeCount}</h2>
                </div>
        {/*        <p style={seeMore} onClick={() => handleSeeMore()}
                   className={"text-right m-5 cursor-pointer hover:font-bold"}>See More</p>*/}
                <div className={"flex justify-center flex-wrap  gap-9"}>
                    {likes.map(item => (
                        <FavoritePost key={item._id} id={item._id} title={item.title} description={item.description}
                                  category={item.category}
                                  price={item.price} image={item.image}/>
                    ))
                    }
                </div>

            </div>

        </div>
    )
}


