import { IProduct } from "./products";

export interface ICategory{
  _id:string;
  name:string;
  type:string;
  image:string;
  products:IProduct[]
}