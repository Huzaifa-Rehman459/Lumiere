import { useState, useEffect } from "react";
import Hero from "../components/Hero/Hero";
import Details from "../components/Details/Details";
import ProductCarousel from "../components/ProductCarousel/ProductCarousel";
import Banner from "../components/Banner/Banner";
import Footer from "../components/Footer/Footer";
import { apiRequest } from "../api/client";

const ROW_SIZE = 8;
const MAX_CATEGORY_ROWS = 4;

const Home = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [bestSellers, categoriesRes] = await Promise.all([
          apiRequest(`/products?bestSeller=true&limit=${ROW_SIZE}&sort=newest`),
          apiRequest("/categories"),
        ]);

        const categoriesToShow = categoriesRes.categories.slice(0, MAX_CATEGORY_ROWS);

        const categoryRows = await Promise.all(
          categoriesToShow.map(async (cat) => {
            const data = await apiRequest(
              `/products?category=${cat.slug}&limit=${ROW_SIZE}&sort=newest`
            );
            return {
              key: cat._id,
              title: cat.name,
              viewAllLink: `/shop/${cat.slug}`,
              products: data.products,
            };
          })
        );

        if (cancelled) return;

        const builtRows = [
          {
            key: "best-sellers",
            title: "Best Sellers",
            viewAllLink: "/ShopAll",
            products: bestSellers.products,
          },
          ...categoryRows,
        ].filter((row) => row.products.length > 0);

        setRows(builtRows);
      } catch (err) {
        console.error("Could not load homepage products:", err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <Hero />
      <Details />

      {!loading &&
        rows.map((row) => (
          <ProductCarousel
            key={row.key}
            title={row.title}
            viewAllLink={row.viewAllLink}
            products={row.products}
          />
        ))}

      <Banner />
      <Footer />
    </div>
  );
};

export default Home;