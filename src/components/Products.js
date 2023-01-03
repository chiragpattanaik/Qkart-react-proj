import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import ProductCard from "./ProductCard";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import Cart from "./Cart";
import "./Products.css";


// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


const Products = () => 
{
  const { enqueueSnackbar } = useSnackbar();

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */

   const [data, setData] = useState({data: []});
  const [load, setLoad] = useState(false);
  const [success, setSuccess] = useState(false);
  const [search,setSearch] = useState(false);
  const [delay, setDelay] = useState(0);
  const userdata = localStorage.getItem("username");
  const islogin = userdata ? true : false;
  const token = localStorage.getItem("token");
  console.log("token=>",token)



   //useffect hook 
  
    useEffect(() => {
      performAPICall();
      fetchCart(token);
    }, []);
    //useffect hook 
   


  const performAPICall = async () => {
    setLoad(true);//this boolean value indicates the start fetching of the data from the api
    try {
      const response = await axios.get(`${config.endpoint}/products`);
      setData((val) => ({ ...val, data: response.data }));
      setSuccess(true);
      setLoad(false);// indicating that the API call has completed.
    } 
    catch (error) 
    {
      if (error.response) 
      {
        enqueueSnackbar(error.response.statusText, { variant: "warning" });
      }
      setLoad(false);
    }
  };





  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
   const performSearch = async (text) => {
    const searchProduct = text.target.value;
    setSearch(true)//inidcates start of fetching the data from api using api call.
    try 
    {
      const response = await axios(`${config.endpoint}/products/search?value=${searchProduct}`);
      setData((val) => ({ ...val, data: response.data }));
      setSearch(false);//inidcates that the Api call is completed.
      setSuccess(true);
    } 
    catch (error) 
    {
      
      if (error.response) 
      {
        enqueueSnackbar(error.response.statusText, { variant: "warning" });
      }
      setSuccess(false);
    }
  };


  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
   const debounceSearch = (event, debounceTimeout) => {
    if (delay !== 0) {
      clearTimeout(delay);
    }
    const timer = setTimeout(() => performSearch(event), debounceTimeout);
    setDelay(timer);
  };



  const fetchCart = async (token) => 
  {
      if (!token ) return;
  else{
    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  }
      
    };

   

  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => 
  {
    let ispresent = false;
    items.map((ele) =>
    { 
      if(ele.productId === productId)
      {
        ispresent = true;
      }

    })
    return ispresent;
   
  };
 
  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (token,items,products,productId,qty,options = { preventDuplicate: false }) => 
  {
    if(token)
    {
      if(isItemInCart(items))
      {
        enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item",{ variant: "warning" });
      }
      else
      {
        addToCartMain(productId,qty);
      }
    }
    else
    {
      enqueueSnackbar("Login to add an item to the Cart",{ variant: "warning" });
    }
    

  };

  const addToCartMain=async(productId,qty,token) =>
  {
    if (!token ) return;
else{
  try {
    // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
    const response = await axios.post(`${config.endpoint}/cart`, 
    {
      productId:productId,
      qty:qty

    },
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    console.log(response.data);
    return response.data;
  } catch (e) {
    if (e.response && e.response.status === 400) {
      enqueueSnackbar(e.response.data.message, { variant: "error" });
    } else {
      enqueueSnackbar(
        "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
        {
          variant: "error",
        }
      );
    }
    return null;
  }
}
    
  };


  return (
    <div>
      <Header children>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <Box>
          <TextField
            className="search-desktop"
            size="small"
            sx={{ width: "45vw" }}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
            onChange={(e) => debounceSearch(e, 500)}
            placeholder="Search for items/categories"
            name="search"
          />
        </Box>
      </Header>

      {/* Search view for mobiles */}

      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        onChange={(e) => debounceSearch(e, 500)}
        placeholder="Search for items/categories"
        name="search"
      />

      <Grid container mb={2}>
        <Grid item md={islogin ? 9 : 12}>
          <Grid item className="product-grid">
            <Box className="hero">
              <p className="hero-heading">
                India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                to your door step
              </p>
            </Box>
          </Grid>

          {/* when the api is fetchingn the products from backend it displays loading icon */}
          {load === true && (
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              className="loading"
            >
              <Grid item>
                <CircularProgress size={40} color="success" />
              </Grid>
              <Grid item>
                <div>Loading Products...</div>
              </Grid>
            </Grid>
          )}

          {!load && !success && (
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              className="loading"
            >
              <Grid item>
                <div>No Products Found</div>
              </Grid>
            </Grid>
          )}
           {/* when the api is fetchingn the products from backend it displays loading icon */}



          {/* After loading render the product on the page */}
          <Grid item ml={1} my={2}>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 1, md: 1 }}
            >
              {success === true &&
                data.data.map((item) => (
                  <Grid item xs={6} sm={6} md={3} key={item._id}>
                    <ProductCard product={item} />
                  </Grid>
                ))}
            </Grid>
          </Grid>
        </Grid>
        {/* After loading render the product on the page */}

        
        {/* Should show cart with items added by the particular user or not */}
        {islogin && (

          <Grid item md={3} xs={12} style={{ backgroundColor: "#E9F5E1" }} mb={2}>

            <Cart />

          </Grid>
        )}
      </Grid>
     {/* Should show cart with items added by the particular user or not */}
      <Footer />
    </div>
  );
};

export default Products;


