import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  IconButton,
  Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  //implement the get products function
  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/products')
      setProducts(res.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  };

  //implement the delete function
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/products/${id}`);
      setProducts((prev => prev.filter((item) => item.id !== id)));
    } catch (err) {
      console.error(err);
      setError('Failed to delete product')
    }
  };

  // Initially fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  // Loading indicator when fetching
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h6">Loading products...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" align="center" sx={{ fontWeight: 600 }} gutterBottom>
        Simple Card List
      </Typography>

      {/* Only render the error message when error is a non-empty string */}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {products.length === 0 ? (
        <Typography>No products available.</Typography>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <Card sx={{ borderRadius: 3 }}>
                {/* Wrap image + delete icon for icon overlay */}
                <Box sx={{ position: 'relative' }}>
                  {product.imageUrl && (
                    <CardMedia
                      component="img"
                      height="180"
                      image={product.imageUrl}
                      alt={product.name}
                    />
                  )}

                  {/* Red delete icon in top-left of the image */}
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDelete(product.id)}
                    size="small"
                    color="error"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      bgcolor: 'white',
                      '&:hover': { bgcolor: 'white' },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
                  {/* The informationn under the card */}
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {product.name}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mt: 1}}>
                      ${product.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
          ))}
        </Grid>
      )}

    </Container>
  );
};

export default ProductList;