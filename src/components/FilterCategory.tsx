
interface FilterCategory {
    type: string;
    name: string;
    color: string;
}

export default function FilterCategory(props: FilterCategory){
    return (
        <label className={`pl-2 has-[:checked]:bg-${props.color} has-[:checked]:text-black py-2 rounded-lg shadow-md hover:bg-auburn-100 hover:scale-110 duration-125 ease-in-out}`}>
                <input type={props.type} name={props.name} value={props.name}/>
            <span className="pl-2">
        {props.name}
            </span>
        </label>
    );
}