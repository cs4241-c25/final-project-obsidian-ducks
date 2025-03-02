"use server";
import { getServerSession } from "next-auth";

import { Session } from "@/lib/types";
import PhotoManager from "@/lib/PhotoManager";
import Item from "@/models/Item";
import Like from "@/models/Like";
import User from "@/models/User";


export async function postLogin(formData: FormData) {
    try {
        const response = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            body: formData,
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error("API Error:", errorText);
            throw new Error(errorText);
        }
        const data = await response.json();
        if (data.error) {
            return { error: data.error };
        }
        console.log("Logged in correctly! :)");
        return { success: true, username: data.username };
    } catch (e) {
        console.error("Login failed:", e);
        return { error: "Login failed" };
    }
}

export async function postRegister(formData: FormData) {
    try {
        const email = formData.get("username") as string;

        console.log("Email:", email);

        const response = await fetch("http://localhost:3000/api/register", {
            method: "POST",
            body: formData,
        });
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        if (data.error) {
            return { error: data.error };
        }
        console.log("Register correctly");
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: "Registration failed" };
    }
}

export async function postItem(formData: FormData) {
    const session: Session = await getServerSession();
    if (session == null) {
        throw new Error("Unauthorized user. User session missing");
    }

    // Upload image to S3 bucket
    const photoManager = new PhotoManager();
    try {
        var url = await photoManager.upload(formData.get("image") as File);
    } catch (e) {
        console.error(e);
    }

    // Remove image from form data
    formData.delete("image");

    // Upload everything else
    try {
        // Upload item to "items" collection
        const item = new Item(
            Object.fromEntries(formData.entries())
        );
        item.image = url;
        item.username = session.user.name;
        await item.save();

        // Initialize "Like" document for item
        const like = new Like({
            itemID: item._id
        });
        await like.save();

        // Update user document to hold item
        await User.updateOne({
            "username": session.user.name
        },{
            $push : {
                "items": item._id
            }
        });

        return item._id.toString();
    } catch (e) {
        console.error(e);
    }
}

