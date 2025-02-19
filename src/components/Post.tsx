import Button from "@/components/Button";

async function getPosts() {
    "use server";
    try {
        const response = await fetch("http://localhost:3000/api/items", {
            method: "GET",
        });
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        console.log(data);
    } catch (e) {
        console.error(e);
    }
}
export default function Post() {
    return (
        <div className="border-1 border-auburn-500">
            <Button onClick={getPosts()}></Button>
            <h1>Image</h1>
            <div className="flex flex-col content-end">
            <h1>Name</h1>
            <h1>Price</h1>
            </div>
        </div>
    )
}