interface ItemPost {
    id: string;
    title: string;
    category: string;
    price: number;
    image: string;
}

export default function ItemPost(props: ItemPost) {
    return (
        <figure className="">
            <img className="w-[250px] h-[250px] rounded-sm object-cover" src={props.image} alt={props.title} />
            <figcaption>
                <p className="font-semibold tracking-wider">${props.price}.00</p>
                <p className="opacity-75">{props.category}</p>
            </figcaption>
        </figure>
    );
}