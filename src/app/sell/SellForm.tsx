"use client";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState} from "react";

import Button from "@/components/Button";
import FileDropzone from "@/components/FileDropzone";
import TextArea from "@/components/TextArea";
import TextInput from "@/components/TextInput";
import SelectInput from "@/components/SelectInput";

import { ITEM_CATEGORIES } from "@/lib/types";
import { postItem } from "@/lib/actions";


export default function SellForm() {
    const [files, setFiles] = useState<File[]>([]);
    const router = useRouter();

    function updateFiles(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files === null) return;
        const buffer = [];
        for (const file of e.target.files) {
            buffer.push(file);
        }
        setFiles(buffer);
    }

    async function uploadItem(e: FormEvent) {
        e.preventDefault();

        try {
            const itemID = await postItem(new FormData(e.target as HTMLFormElement));
            router.push(`/listing/${itemID}`);
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <form className="w-full xl:w-3/4" onSubmit={uploadItem}>
            <h1 className="font-semibold text-lg text-center pt-8 mb-8">Sell an Item</h1>
            <div className="flex flex-col justify-center gap-6 xl:flex-row">
                <FileDropzone className="w-full h-[25vh] xl:w-1/2 xl:h-[44.5vh] 2xl:w-9/20 2xl:h-140" files={files} changeHandler={updateFiles}/>
                <div className="flex flex-col gap-3 xl:w-1/2 2xl:w-fit">
                    <TextInput className="xl:w-1/2 2xl:w-100" type="text" name="title" placeholder="What are you selling?">
                        Title<span className="text-crimson-500"> *</span>
                    </TextInput>
                    <TextInput className="xl:w-1/5 2xl:w-25" type="number" name="price" placeholder="5.99">
                        Price<span className="text-crimson-500"> *</span>
                    </TextInput>
                    <SelectInput className="xl:w-fit" name="category" options={ITEM_CATEGORIES}>
                        Category<span className="text-crimson-500"> *</span>
                    </SelectInput>
                    <TextArea className="w-full h-[15vh] xl:w-3/4 2xl:w-100 2xl:h-60" name="description" placeholder="E.g., Recently bought new. ">
                        Description<span className="text-crimson-500"> *</span>
                    </TextArea>
                    <div className="flex gap-2 xl:w-3/4 2xl:w-full">
                        <Button className="w-25 grow bg-gray-600 hover:bg-gray-800" type="reset" onClick={() => setFiles([])}>Reset</Button>
                        <Button className="w-25 grow" type="submit">Submit</Button>
                    </div>
                </div>
            </div>
        </form>
    );
}