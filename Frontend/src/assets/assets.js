import dressImg from "./dress-img-1.jpg";
import dressImg2 from "./dress-img-2.jpg";
// assets.js
const bestSeller = [
  { id: 1, image: dressImg, name: "Silk Wrap Dress", price: 89, oldPrice: 140, category: "dresses" },
  { id: 2, image: dressImg2, name: "Silk Wrap Dress", price: 49, oldPrice: 100, category: "tops" },
  { id: 3, image: dressImg, name: "Silk Wrap Dress", price: 70, oldPrice: 90, category: "bottoms" },
  { id: 4, image: dressImg2, name: "Silk Wrap Dress", price: 20, oldPrice: 40, category: "dresses" },
];

export const categories = [
  { id: 1, image: dressImg, title: "Dresses", text: "Elegant pieces for every occasion.", link: "Shop Dresses", slug: "dresses" },
  { id: 2, image: dressImg2, title: "Tops", text: "From casual to chic, find your perfect top.", link: "Shop Tops", slug: "tops" },
  { id: 3, image: dressImg, title: "Bottoms", text: "Comfort meets style in every step.", link: "Shop Bottoms", slug: "bottoms" },
  { id: 4, image: dressImg, title: "Blazers & Outerwear", text: "Layer up with confidence.", link: "Shop Outerwear", slug: "outerwear" },
  { id: 5, image: dressImg2, title: "Sets", text: "Effortless looks, together.", link: "Shop Sets", slug: "sets" },
  { id: 6, image: dressImg, title: "Accessories", text: "Little details, big impact.", link: "Shop Accessories", slug: "accessories" },
];

export default bestSeller;