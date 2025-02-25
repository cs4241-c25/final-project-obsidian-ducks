export enum ItemCategory {
    Clothes = "Clothes",
    Electronics = "Electronics",
    HomeEssentials = "Home Essentials",
    HandMade = "Handmade",
    Furniture = "Furniture",
    Stationary = "Stationary"
}

export const ITEM_CATEGORIES = [
    ItemCategory.Clothes,
    ItemCategory.Electronics,
    ItemCategory.Furniture,
    ItemCategory.HomeEssentials,
    ItemCategory.HandMade,
    ItemCategory.Stationary,
];

export type Item = {
    id: string;
    title: string;
    price: number;
    category: string;
    description: string;
    image: string;
}
