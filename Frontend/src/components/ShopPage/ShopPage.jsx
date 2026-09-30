import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ShopPage.css";
import { apiRequest } from "../../api/client";
import ShopAllCard from "../ShopAllCard/ShopAllCard";

const SIZES = ["XS", "S", "M", "L", "XL"];
const COLORS = ["Black", "Blue", "Pink", "Green", "Beige", "Red"];
const PRICE_RANGES = {
  "0-50": { minPrice: 0, maxPrice: 50 },
  "50-100": { minPrice: 50, maxPrice: 100 },
  "100+": { minPrice: 100 },
};
const PAGE_SIZE = 9;

const ShopPage = () => {
  const { category: urlCategorySlug } = useParams();

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [priceRange, setPriceRange] = useState(null);
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);

  const [products, setProducts] = useState([]);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load the category list for the sidebar once.
  useEffect(() => {
    apiRequest("/categories")
      .then((data) => setCategories(data.categories))
      .catch((err) => console.error("Could not load categories:", err.message));
  }, []);

  useEffect(() => {
    if (urlCategorySlug) {
      setSelectedCategories([urlCategorySlug]);
    }
  }, [urlCategorySlug]);

  // Any filter/sort change goes back to page 1 — otherwise you could land on
  // "page 3" of a filtered result that only has 1 page.

  const handleCategoryToggle = (slug) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
    setPage(1);
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
    setPage(1);
  };

  const handleColorSelect = (color) => {
    setSelectedColor((prev) => (prev === color ? null : color)); // click again to clear
    setPage(1);
  };

  const handlePriceSelect = (key) => {
    setPriceRange((prev) => (prev === key ? null : key));
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1);
  };

  // Fetch products whenever any filter, sort, or page changes.
  useEffect(() => {
    setLoading(true);
    setError("");

    const params = new URLSearchParams();
    if (selectedCategories.length) params.set("category", selectedCategories.join(","));
    if (selectedSizes.length) params.set("size", selectedSizes.join(","));
    if (selectedColor) params.set("color", selectedColor);
    if (priceRange) {
      const { minPrice, maxPrice } = PRICE_RANGES[priceRange];
      if (minPrice !== undefined) params.set("minPrice", minPrice);
      if (maxPrice !== undefined) params.set("maxPrice", maxPrice);
    }
    params.set("sort", sort);
    params.set("page", page);
    params.set("limit", PAGE_SIZE);

    let cancelled = false;

    apiRequest(`/products?${params.toString()}`)
      .then((data) => {
        if (cancelled) return;
        setProducts(data.products);
        setPages(data.pages);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedCategories, selectedSizes, selectedColor, priceRange, sort, page]);

  return (
    <div className="shop-page">
      <div className="shop-page-content">
        <aside>
          <div className="category-box">
            <h2>Category</h2>
            {categories.map((cat) => (
              <div className="category-checkbox" key={cat._id}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.slug)}
                  onChange={() => handleCategoryToggle(cat.slug)}
                />
                <span>{cat.name}</span>
              </div>
            ))}
          </div>

          <div className="size-box">
            <h2>Size</h2>
            {SIZES.map((size) => (
              <div className="size-box-checkbox" key={size}>
                <input
                  type="checkbox"
                  checked={selectedSizes.includes(size)}
                  onChange={() => handleSizeToggle(size)}
                />
                <span>{size}</span>
              </div>
            ))}
          </div>

          <div className="color-box">
            <h2>Color</h2>
            <div className="colors">
              {COLORS.map((color) => (
                <label key={color}>
                  <input
                    type="radio"
                    name="color"
                    checked={selectedColor === color}
                    onChange={() => handleColorSelect(color)}
                  />
                  <span className={`color ${color.toLowerCase()}`}></span>
                </label>
              ))}
            </div>
          </div>

          <div className="price-range-box">
            <h2>Price Range</h2>
            {Object.keys(PRICE_RANGES).map((key) => (
              <div className="price-range-checkbox" key={key}>
                <input
                  type="checkbox"
                  checked={priceRange === key}
                  onChange={() => handlePriceSelect(key)}
                />
                <span>
                  {key === "100+"
                    ? "$100+"
                    : `$${PRICE_RANGES[key].minPrice} - ${PRICE_RANGES[key].maxPrice}`}
                </span>
              </div>
            ))}
          </div>
        </aside>

        <div className="shop-product-cards">
          <div className="sorting-boxes">
            <div className="sort-box">
              <span>Sort By:</span>
              <select value={sort} onChange={handleSortChange}>
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {loading && <p className="shop-status">Loading products...</p>}
          {error && <p className="shop-status shop-status--error">{error}</p>}
          {!loading && !error && products.length === 0 && (
            <p className="shop-status">No products match these filters.</p>
          )}

          {!loading && !error && products.length > 0 && (
            <>
              <div className="shopAll-products">
                {products.map((item) => (
                  <ShopAllCard
                    key={item._id}
                    id={item._id}
                    image={item.images[0]?.url}
                    name={item.name}
                    price={item.price}
                  />
                ))}
              </div>

              {pages > 1 && (
                <div className="pagination">
                  <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                    Previous
                  </button>
                  <span>
                    Page {page} of {pages}
                  </span>
                  <button disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;