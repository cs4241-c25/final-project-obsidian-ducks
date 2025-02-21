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

//the message type as a normal typescript type 
export type Messsage = {
  event:Event
  message:string,
  sender:string,
  recver:string
}



