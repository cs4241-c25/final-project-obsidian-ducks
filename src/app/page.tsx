import ChatSession from "@/components/chat/chatSession";
import HeroSection from "./HeroSection";
import ItemsSection from "./ItemsSection";
import Item from "@/models/Item";
import connectToDatabase  from "@/lib/db";
async function getPosts() {
    try {
        const response = await fetch("http://localhost:3000/api/items", {
            method: "GET",
        });
        if (!response.ok) throw new Error(response.statusText);
        return await response.json();
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export default async function Home() {
    await connectToDatabase()
    let items = []
    try {
      items = await Item.find({}).exec();
      items = items.map(item => ({
        id: item._id.toString(),
        title: item.title,
        price: item.price,
        category: item.category,
        description: item.description,
        image: item.image
      }));
    } catch(error) {
      console.log(error)
    }
    return (
        <main className="overflow-x-hidden">
            <HeroSection/>
            <ItemsSection items={items}/>
        </main>
    );
}
