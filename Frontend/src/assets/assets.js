import dressImg from "./dress-img-1.jpg";
import dressImg2 from "./dress-img-2.jpg";
// assets.js
const bestSeller = [
  {
    id: 1,
    image: dressImg,
    name: "Silk Wrap Dress",
    price: 89,
    oldPrice: 140,
    category: "dresses",
    rating: 4.5,
    reviewCount: 128,
    description:
      "A flowy wrap dress made from soft, breathable silk-blend fabric. Perfect for brunches, vacations, or casual days out.",
  },
  {
    id: 2,
    image: dressImg2,
    name: "Silk Wrap Dress",
    price: 49,
    oldPrice: 100,
    category: "tops",
    rating: 4.2,
    reviewCount: 84,
    description:
      "A lightweight, versatile top that pairs easily with jeans or skirts. Soft against the skin and easy to care for.",
  },
  {
    id: 3,
    image: dressImg,
    name: "Silk Wrap Dress",
    price: 70,
    oldPrice: 90,
    category: "bottoms",
    rating: 4.7,
    reviewCount: 56,
    description:
      "A relaxed-fit piece designed for everyday comfort without giving up on style. Runs true to size.",
  },
  {
    id: 4,
    image: dressImg2,
    name: "Silk Wrap Dress",
    price: 20,
    oldPrice: 40,
    category: "dresses",
    rating: 4.0,
    reviewCount: 32,
    description:
      "An easy layering piece with clean lines and a flattering silhouette. Works from day to night.",
  },
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