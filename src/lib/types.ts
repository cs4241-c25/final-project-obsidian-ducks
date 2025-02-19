export enum ItemCategory {
    Furniture = "Furniture",
    Electronics = "Electronics",
    Clothes = "Clothes",
    Stationary = "Stationary",
    HomeEssentials = "Home Essentials",
    HandMade = "Handmade"
}

export const ITEM_CATEGORIES = [
    ItemCategory.Furniture,
    ItemCategory.Electronics,
    ItemCategory.Clothes,
    ItemCategory.Stationary,
    ItemCategory.HomeEssentials,
    ItemCategory.HandMade
];


export type Event = "REGISTER" | "MESSAGE"

export type Message = {
  event:Event
  message:string,
  sender:string,//todo change this to an id?
  recver:string,//todo change this to a user id or chat id?
  read:boolean
}
