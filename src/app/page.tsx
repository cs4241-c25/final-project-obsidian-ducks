import Post from "@/components/Post";

async function getPosts() {
    try {
        const response = await fetch("http://localhost:3000/api/items", {
            method: "GET",
        });
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
    } catch (e) {
        console.error(e);
    }
}

export default async function Home() {
    const posts = await getPosts();
    return (
        <main>
            <div className="flex flex-row grid grid-cols-4">

                <div className="w-80 bg-onyx-100 h-screen">
                    <h1>
                        Test
                    </h1>
                </div>

                <div className="grid grid-cols-3 col-span-3 gap-10 justify-center mr-20 mt-10">
                    {posts.map((post) => (
                        <Post key={post._id} _id={post._id} title={post.title} description={post.description} category={post.category}
                              price={post.price} image={post.image}/>
                    ))}
                </div>


            </div>
        </main>
    );
}
