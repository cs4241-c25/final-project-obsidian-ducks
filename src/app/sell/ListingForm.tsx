import Button from "@/components/Button";
import FileInput from "@/components/FileInput";
import TextArea from "@/components/TextArea";
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
                    <TextInput className="w-100" type="text" name="title" placeholder="What are you selling?">Title</TextInput>
                    <TextArea className="w-100 h-60" name="description" placeholder="E.g., Recently bought new. ">Description</TextArea>
                    <SelectInput name="category" options={ITEM_CATEGORIES}>Category</SelectInput>
                    <TextInput className="w-25" type="number" name="price" placeholder="5.99">Price</TextInput>
                    <div className="flex gap-2">
                        <Button className="w-25 grow bg-gray-500 hover:bg-gray-600" type="reset">Reset</Button>
                        <Button className="w-25 grow" type="submit">Submit</Button>
                    </div>
                </div>
            </div>
        </form>
    );
}