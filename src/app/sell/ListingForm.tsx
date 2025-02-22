import Button from "@/components/Button";
import FileInput from "@/components/FileInput";
import TextInput from "@/components/TextInput";
import SelectInput from "@/components/SelectInput";

import { ITEM_CATEGORIES } from "@/lib/types";

async function postItem(formData: FormData) {
    "use server";
    try {
        const response = await fetch("http://localhost:3000/api/items", {
            method: "POST",
            body: formData
        });
        if (!response.ok) throw new Error(response.statusText);
    } catch (e) {
        console.error(e);
    }
}

export default function ListingForm() {
    return (
        <form action={postItem}>
            <h1 className="font-bold text-lg text-center mb-6">Sell an Item</h1>
            <div className="flex gap-4">
                <FileInput />
                <div className="flex flex-col gap-3">
                    <TextInput type="text" name="title" placeholder="What are you selling?">Title</TextInput>
                    <TextInput type="text" name="description" placeholder="Describe your item.">Description</TextInput>
                    <SelectInput name="category" options={ITEM_CATEGORIES}>Category</SelectInput>
                    <TextInput type="number" name="price" placeholder="What's the price?">Price</TextInput>
                    <div className="flex">
                        <Button type="reset">Reset</Button>
                        <Button type="submit">Submit</Button>
                    </div>
                </div>
            </div>
        </form>
    );
}