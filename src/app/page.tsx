import HeroSection from "./HeroSection";
import ItemsSection from "./ItemsSection";
import Item from "@/models/Item";
import connectToDatabase from "@/lib/db";
import { connection } from 'next/server'

export default async function Home() {

    return (
        <main className="overflow-x-hidden pb-20">
            <HeroSection/>
            <ItemFetcher/>
        </main>
    );
}

async function ItemFetcher() {
  await connection(); // this alows us to stop our page from being
  let items = [];
  try {
      await connectToDatabase();
    items = await Item.find({}).exec();
    items = items.map(item => ({
      id: item._id.toString(),
      title: item.title,
      price: item.price,
      category: item.category,
      description: item.description,
      image: item.image
    }));
  } catch(e) {
    console.error(e);
  }
  return (
    <ItemsSection items={items}/>
  )
}
