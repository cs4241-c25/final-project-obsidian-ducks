import HeroSection from "./HeroSection";
import ItemsSection from "./ItemsSection";
import Item from "@/models/Item";
import "@/lib/db";

export default async function Home() {
    let items = [];
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
      console.log(items)
    } catch(error) {
      console.log(error)
    }
    return (
        <main className="overflow-x-hidden pb-20">
            <HeroSection/>
            <ItemsSection items={items}/>
        </main>
    );
}
