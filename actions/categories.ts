"use server";

import { createClient } from "@/lib/server";
import { revalidatePath } from "next/cache";

function toSlug(name: string) {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}

export async function getCategories() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

    if (error) {
        console.error("Error fetching categories:", error.message);
        return [];
    }
    return data ?? [];
}

export async function createCategory(name: string) {
    const supabase = await createClient();
    const slug = toSlug(name);

    const { data, error } = await supabase
        .from("categories")
        .insert({ name: name.trim(), slug })
        .select()
        .single();

    if (error) {
        console.error("Error creating category:", error.message);
        throw new Error(error.message);
    }

    revalidatePath("/admin/categories");
    return data;
}

export async function updateCategory(id: string, name: string) {
    const supabase = await createClient();
    const slug = toSlug(name);

    const { data, error } = await supabase
        .from("categories")
        .update({ name: name.trim(), slug })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error updating category:", error.message);
        throw new Error(error.message);
    }

    revalidatePath("/admin/categories");
    return data;
}

export async function deleteCategory(id: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting category:", error.message);
        throw new Error(error.message);
    }

    revalidatePath("/admin/categories");
}
