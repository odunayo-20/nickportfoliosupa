import { getCategories } from "@/actions/categories";
import { CategoriesClient } from "./CategoriesClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Categories | Nikola",
    description: "Categories for Nikola Portfolio",
};

export default async function CategoriesPage() {
    const categories = await getCategories();
    return <CategoriesClient initialCategories={categories} />;
}
