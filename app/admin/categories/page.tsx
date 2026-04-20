import { getCategories } from "@/actions/categories";
import { CategoriesClient } from "./CategoriesClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Categories | Admin",
};

export default async function CategoriesPage() {
    const categories = await getCategories();
    return <CategoriesClient initialCategories={categories} />;
}
