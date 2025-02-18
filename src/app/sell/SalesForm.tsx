import Button from "@/components/Button";
import PhotoInput from "@/components/PhotoInput";
import TextInput from "@/components/TextInput";
import SelectInput from "@/components/SelectInput";

export default function SalesForm() {
    const itemCategories = [
        "Furniture",
        "Electronics",
        "Clothes",
        "Stationary",
        "Home Essentials",
        "Handmade"
    ];

    return (
        <form>
            <h1>Sell an Item</h1>
            <PhotoInput />
            <TextInput type={"text"} name={"title"} placeholder={"What are you selling?"}>Title</TextInput>
            <TextInput type={"text"} name={"description"} placeholder={"Describe your item."}>Description</TextInput>
            <SelectInput name={"category"} options={itemCategories}>Category</SelectInput>
            <TextInput type={"number"} name={"price"} placeholder={"How much are you selling it for?"}>Price</TextInput>
            <Button>Submit</Button>
        </form>
    );
}