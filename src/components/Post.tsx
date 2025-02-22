import Button from "@/components/Button";
import Image from "next/image";
import Link from "next/link";
interface PostInput {
    _id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    image: string;
}

export default function Post(props: PostInput) {
    return (
        <div>
            <div className="w-[300px] h-[340px] shadow-xl">
                <div className="relative h-[250px]">
                    <Link href={`/post/${props._id}`}>
                        <Button type="button">
                    <Image priority={false}
                           src={props.image}
                           fill alt="Test" style={{objectFit: "cover"}}/>
                        </Button>
                    </Link>
                    <Button type="button" className="absolute top-2 right-2 z-10 p-2 rounded-full">
                        <Image src="/heart.svg" alt="Heart Image" width={15} height={15}/>
                    </Button>
                </div>
                <div className="border-black pl-2 my-2">
                    <h1 className="font-bold">{props.title}</h1>
                    <h1>{props.category}</h1>
                    <h1>{props.price}</h1>
                </div>
            </div>
        </div>
    )
}