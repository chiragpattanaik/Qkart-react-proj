import { AddShoppingCartOutlined } from "@mui/icons-material";
import IconButton from '@mui/material/IconButton';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card">
       <CardMedia
        image={product.image}
        component="img"
        alt={product.name}
      />
        <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ${product.cost}
        </Typography>
        <Typography component="legend">Read only</Typography>
      <Rating name="read-only" value={product.rating} readOnly />
      </CardContent>
      <CardActions>
      <Button size="small" variant="contained" fullWidth className="card-button" onClick={()=>handleAddToCart(product)}>ADD TO CART</Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
