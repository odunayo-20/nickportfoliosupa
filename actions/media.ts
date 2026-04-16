"use server";

import { createClient } from "@/lib/server";
import { revalidatePath } from "next/cache";
import { Database } from "@/types/database";

type MediaInsert = Database["public"]["Tables"]["media"]["Insert"];

export async function createMedia(data: MediaInsert) {
    const supabase = await createClient();
    const { data: media, error } = await supabase
        .from("media")
        .insert(data)
        .select()
        .single();

    if (error) {
        console.error("Error creating media entry:", error);
        throw new Error(error.message);
    }

    revalidatePath("/admin/media");
    return media;
}

export async function deleteMedia(id: string, storagePath: string) {
    const supabase = await createClient();
    
    // 1. Delete from storage
    const { error: storageError } = await supabase.storage
        .from("media")
        .remove([storagePath]);

    if (storageError) {
        console.error("Error deleting from storage:", storageError);
        // We might still want to delete the DB entry if it's orphaned, or handle this error
    }

    // 2. Delete from DB
    const { error: dbError } = await supabase
        .from("media")
        .delete()
        .eq("id", id);

    if (dbError) {
        console.error("Error deleting media entry from DB:", dbError);
        throw new Error(dbError.message);
    }

    revalidatePath("/admin/media");
}

export async function createFolder(name: string, parentId?: string) {
    const supabase = await createClient();
    
    const { data: authData } = await supabase.auth.getUser();
    console.log("SERVER ACTION AUTH USER:", authData?.user?.id || "NO USER FOUND");

    const { data: folder, error } = await supabase
        .from("folders")
        .insert({ name, parent_id: parentId })
        .select()
        .single();

    if (error) {
        console.error("Error creating folder:", error);
        throw new Error(error.message);
    }

    revalidatePath("/admin/media");
    return folder;
}

export async function deleteFolder(id: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("folders")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting folder:", error);
        throw new Error(error.message);
    }

    revalidatePath("/admin/media");
}

export async function renameFolder(id: string, name: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("folders")
        .update({ name })
        .eq("id", id);

    if (error) {
        console.error("Error renaming folder:", error);
        throw new Error(error.message);
    }

    revalidatePath("/admin/media");
}

export async function getFolders(parentId?: string) {
    const supabase = await createClient();
    let query = supabase.from("folders").select("*");
    
    if (parentId) {
        query = query.eq("parent_id", parentId);
    } else {
        query = query.is("parent_id", null);
    }

    const { data, error } = await query.order("name");
    
    if (error) {
        console.error("Error fetching folders:", error);
        throw new Error(error.message);
    }

    return data;
}

export async function getMediaByFolder(folderId?: string) {
    const supabase = await createClient();
    let query = supabase.from("media").select("*");
    
    if (folderId) {
        query = query.eq("folder_id", folderId);
    } else {
        query = query.is("folder_id", null);
    }

    const { data, error } = await query.order("created_at", { ascending: false });
    
    if (error) {
        console.error("Error fetching media:", error);
        throw new Error(error.message);
    }

    return data;
}

export async function getMediaById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("media")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching media by id:", error);
        return null;
    }

    return data;
}

export async function getMediaByIds(ids: string[]) {
    if (!ids || ids.length === 0) return [];
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("media")
        .select("*")
        .in("id", ids);

    if (error) {
        console.error("Error fetching media by ids:", error);
        return [];
    }

    return data;
}
