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
   const [data, setData] = useState({
    data: [],
  });
  const [load, setLoad] = useState(false);
  const [success, setSuccess] = useState(false);
  const [search,setSearch] = useState(false);


    // {useEffect hook for the peformApicall}
    useEffect(() => {
      performAPICall();
    }, []);
     // {useEffect hook for the peformApicall}


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
  const debounceSearch = (event, debounceTimeout) => 
  {
    setTimeout(()=>{
      performSearch()
    },debounceTimeout);
  };







  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
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
            onChange={(event)=>debounceSearch (event,500)}
            placeholder="Search for items/categories"
            name="search"
          />

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
        placeholder="Search for items/categories"
        name="search"
      />
       <Grid container>
         <Grid item className="product-grid">
           <Box className="hero">
             <p className="hero-heading">
               India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step
             </p>
           </Box>
         </Grid>
       </Grid>

      
      {/* Showing loading products CircularProgress while api is fetching the data */}

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

           {/* Showing loading products CircularProgress while api is fetching the data */}


          {/* If api fails to fetch the data from the url */}

          {
        !load && !success && 
        (
          <Grid container
          direction="column"
          justifyContent="center"
          alignItems="center"
          className="loading">
            <Grid item>
            <div><SentimentDissatisfied /><p>No products found</p></div>
          </Grid>
          </Grid>
        )
      }
   

         {/* If api fails to fetch the data from the url */}
   

      
   



         {/* Upon successful fethcing the data from the api and display it as in the form of cards using grid */}

         <Grid item ml={1} my={2}>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 1, md: 1 }}
            >
              {success === true &&
                data.data.map((item) => (
                  <Grid item xs={6} sm={6} md={3} key={item._id}>
                    <ProductCard product={item}  />
                  </Grid>
                ))}
            </Grid>
          </Grid>


          {/* Upon successful fethcing the data from the api and display it as in the form of cards using grid */}
      <Footer />
    </div>
  );
};

export default Products;