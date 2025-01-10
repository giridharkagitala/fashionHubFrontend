import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Grid, Typography, Card, CardContent, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getUserBackorders } from "../../../Redux/Backorders/Action";

const BackorderList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { backorders = [] } = useSelector((state) => state.backorder);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    console.log("Fetching backorders with JWT:", jwt);
    dispatch(getUserBackorders(jwt)); // Fetch user backorders
  }, [dispatch]);

  return (
    <Box className="p-5">
      <Typography variant="h4" sx={{ marginBottom: "2rem", textAlign: "center" }}>
        My Backorders
      </Typography>

      {backorders.length > 0 ? (
        <Grid container spacing={3}>
          {backorders.map((order) => (
            <Grid item xs={12} sm={6} md={4} key={order.id}>
              <Card sx={{ boxShadow: 2, borderRadius: "10px" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {order.product.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quantity: {order.quantity}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Status: {order.status}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date Created: {new Date(order.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ margin: "1rem" }}
                  onClick={() => navigate(`/product/${order.product.id}`)}
                >
                  View Product
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="h6" sx={{ textAlign: "center", marginTop: "2rem" }}>
          You have no backorders yet.
        </Typography>
      )}
    </Box>
  );
};

export default BackorderList;
