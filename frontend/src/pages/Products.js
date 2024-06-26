import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { Link } from "react-router-dom";

const Products = () => {
  const { cart, fetchCart, addToCart, increaseQuantity, decreaseQuantity } =
    useContext(CartContext);
  const [products, setProducts] = useState([]);
  const { user } = useContext(UserContext);

  // Fetch products from the backend API
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/product")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  // Get the quantity of a product in the cart
  const getProductQuantity = (productId) => {
    let quantity = 0;

    if (cart && cart.cartLines) {
      cart.cartLines.forEach((cartLine) => {
        if (cartLine.productId === productId) {
          quantity = cartLine.quantity;
        }
      });
    }

    return quantity;
  };

  return (
    <div>
      {/* Display the products */}
      <h1 className="fs-4 text-center mt-2 mb-3">Our Products</h1>
      <div className="specials-grid mx-5">
        {/* Map through the products and display them */}
        {products.map((product) => (
          <div key={product.productId} className="specials-item mb-3">
            {/* Link to the product details page */}
            <Link
              to={`/products/${product.productId}`}
              className="product-link"
            >
              <img src={product.imgUrl} alt={product.productName} />
            </Link>
            {/* Display the product details */}
            <div className="specials-text">
              <Link
                to={`/products/${product.productId}`}
                className="product-link"
              >
                <h2 className="fs-6 mb-1">{product.productName}</h2>
              </Link>
              {/* Display the product price */}
              <div
                className="fs-6 mb-1"
                style={{ fontWeight: "lighter", marginBottom: "0" }}
              >
                {product.special ? (
                  <>
                    <p className="card-text">
                      <s>${product.price}</s> ${product.specialPrice}
                    </p>
                  </>
                ) : (
                  <p className="card-text">${product.price}</p>
                )}
              </div>
              {/* Add to cart button */}
              {!user || getProductQuantity(product.productId) === 0 ? (
                <button
                  className="btn custom-button mt-1"
                  onClick={() => {
                    if (user) {
                      addToCart(product.productId, 1);
                    } else {
                      alert("Please log in to add items to the cart.");
                    }
                  }}
                >
                  Add to Cart
                </button>
              ) : (
                // Display the quantity of the product in the cart
                <>
                  <button
                    className="btn custom-button mt-1"
                    onClick={() => decreaseQuantity(product.productId)}
                  >
                    -
                  </button>
                  <span className="mx-2 mt-1">
                    {getProductQuantity(product.productId)}
                  </span>
                  {/* Increase the quantity of the product in the cart */}
                  <button
                    className="btn custom-button mt-1"
                    onClick={() => increaseQuantity(product.productId)}
                  >
                    +
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Display a message if there are no products */}
      {products.length === 0 && <p>Loading products..</p>}
    </div>
  );
};

export default Products;
