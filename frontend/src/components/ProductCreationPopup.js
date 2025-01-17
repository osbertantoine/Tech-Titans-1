import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import axios from 'axios';

const ProductCreationPopup = ({ open, handleClose, refreshProducts }) => {
  const [productDetails, setProductDetails] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrls: [],
  });

  const handleChange = (e) => {
    if (e.target.name === 'imageUrls') {
      setProductDetails({ ...productDetails, [e.target.name]: e.target.value.split(',') });
    } else {
      setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('userToken'); // Ensure this is the correct key for the stored token

      const response = await axios.post('http://localhost:5000/products/register', productDetails, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 201) {
        alert('Product created successfully');
        refreshProducts();
        handleClose();
      }
    } catch (error) {
      alert('Error creating product');
      console.error('Error creating product:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create New Product</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Product Name"
          type="text"
          fullWidth
          variant="standard"
          value={productDetails.name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="description"
          label="Description"
          type="text"
          fullWidth
          variant="standard"
          value={productDetails.description}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="price"
          label="Price"
          type="number"
          fullWidth
          variant="standard"
          value={productDetails.price}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="category"
          label="Category"
          type="text"
          fullWidth
          variant="standard"
          value={productDetails.category}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="imageUrls"
          label="Image URLs (comma-separated)"
          type="text"
          fullWidth
          variant="standard"
          value={productDetails.imageUrls.join(',')}
          onChange={handleChange}
          helperText="Enter image URLs separated by commas"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductCreationPopup;
