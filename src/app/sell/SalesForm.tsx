'use client'
import Button from "@/components/Button";
import PhotoInput from "@/components/PhotoInput";
import TextInput from "@/components/TextInput";
import SelectInput from "@/components/SelectInput";
import {useState} from "react";

export default function SalesForm() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [price, setPrice] = useState('')

    const itemCategories = [
        "Furniture",
        "Electronics",
        "Clothes",
        "Stationary",
        "Home Essentials",
        "Handmade"
    ];
    const handleSubmit = async (e) => {
        e.preventDefault()
        const res = await fetch('api/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({title, description, category, price})
        })
        const item = await res.json()
        console.log(item)
        if(item.status == 200){
            setTitle('');
            setDescription('');
            setCategory('');
            setPrice('');
        }
        else {
            console.log(item.error)
        }
    }


    return (

        <form>
            <h1>Sell an Item</h1>
            <PhotoInput/>
            <TextInput onChange={(e) => setTitle(e.target.value)}  type={"text"} name={"title"} placeholder={"What are you selling?"}>Title</TextInput>
            <TextInput onChange={(e) => setDescription(e.target.value)} type={"text"} name={"description"} placeholder={"Describe your item."}>Description</TextInput>
            <SelectInput onChange={(
                e) => {
                console.log("Parent onChange triggered", e.target.value)
                setCategory(e.target.value)}}
                         name={"category"} options={itemCategories}>Category</SelectInput>
            <TextInput onChange={(e) => setPrice(e.target.value)} type={"number"} name={"price"} placeholder={"How much are you selling it for?"}>Price</TextInput>
            <Button onClick={handleSubmit} >Submit</Button>
        </form>
    );
}