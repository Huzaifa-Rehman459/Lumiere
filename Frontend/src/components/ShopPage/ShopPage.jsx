import React from "react";
import { useParams } from "react-router-dom";
import "./ShopPage.css";
import bestSeller from "../../assets/assets";
import ShopAllCard from "../ShopAllCard/ShopAllCard";

const ShopPage = () => {
  const { category } = useParams(); // reads ":category" from the URL

  const filteredProducts = category
    ? bestSeller.filter((item) => item.category === category)
    : bestSeller; // show all if no category in URL

  return (
    <div className="shop-page">
      <div className="shop-page-content">
        <aside>
          <div className="category-box">
            <h2>Category</h2>
            <div className="category-checkbox">
              <input type="checkbox"></input>
              <span>Dresses</span>
            </div>
            <div className="category-checkbox">
              <input type="checkbox"></input>
              <span>Tops</span>
            </div>
            <div className="category-checkbox">
              <input type="checkbox"></input>
              <span>Bottoms</span>
            </div>
            <div className="category-checkbox">
              <input type="checkbox"></input>
              <span>Outerwear</span>
            </div>
            <div className="category-checkbox">
              <input type="checkbox"></input>
              <span>Sets</span>
            </div>
          </div>
          <div className="size-box">
            <h2>Size</h2>
            <div className="size-box-checkbox">
              <input type="checkbox"></input>
              <span>XS</span>
            </div>
            <div className="size-box-checkbox">
              <input type="checkbox"></input>
              <span>S</span>
            </div>
            <div className="size-box-checkbox">
              <input type="checkbox"></input>
              <span>M</span>
            </div>
            <div className="size-box-checkbox">
              <input type="checkbox"></input>
              <span>L</span>
            </div>
            <div className="size-box-checkbox">
              <input type="checkbox"></input>
              <span>XL</span>
            </div>
          </div>
          <div className="color-box">
            <h2>Color</h2>
            <div className="colors">
              <label>
                <input type="radio" name="color" />
                <span className="color black"></span>
              </label>

              <label>
                <input type="radio" name="color" />
                <span className="color blue"></span>
              </label>

              <label>
                <input type="radio" name="color" />
                <span className="color pink"></span>
              </label>

              <label>
                <input type="radio" name="color" />
                <span className="color green"></span>
              </label>

              <label>
                <input type="radio" name="color" />
                <span className="color beige"></span>
              </label>
              <label>
                <input type="radio" name="color" />
                <span className="color red"></span>
              </label>
            </div>
          </div>
          <div className="price-range-box">
            <h2>Price Range</h2>
            <div className="price-range-checkbox">
              <input type="checkbox"></input>
              <span>$0 - 550</span>
            </div>
            <div className="price-range-checkbox">
              <input type="checkbox"></input>
              <span>$550 - 1000</span>
            </div>
            <div className="price-range-checkbox">
              <input type="checkbox"></input>
              <span>$1000+</span>
            </div>
          </div>
        </aside>
        <div className="shop-product-cards">
          <div className="sorting-boxes">
            <div className="sort-box">
              <span>Sort By:</span>
              <select>
                <option>Featured</option>
                <option>Best Seller</option>
                <option>New</option>
              </select>
            </div>
            <div className="sort-box">
              <span>Order By:</span>
              <select>
                <option>Asscending</option>
                <option>Descending</option>
              </select>
            </div>
          </div>
          <div className="shopAll-products">
            {filteredProducts.map((item) => (
              <ShopAllCard
                key={item.id}
                id={item.id}
                image={item.image}
                name={item.name}
                price={item.price}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;