import { Box, Button, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import OrderTraker from "./OrderTraker";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate, useParams } from "react-router-dom";
import AddressCard from "../adreess/AdreessCard";
import { deepPurple } from "@mui/material/colors";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getOrderById, cancelOrder, getOrderHistory } from "../../../Redux/Customers/Order/Action";
import Modal from "@mui/material/Modal";

const OrderDetails = () => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { orderId } = useParams();
  const { order } = useSelector((store) => store);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (orderId) dispatch(getOrderById(orderId));
  }, [orderId]);

  const handleCancelOrder = () => {
    if (orderId && jwt) {
      dispatch(cancelOrder({ orderId, jwt }));
      setOpen(false);
      setTimeout(() => {
       navigate("/account/order");
       window.location.reload();
        new change
        dispatch(getOrderHistory({ jwt }));
        
      }, 500);
    }
  };

  return (
    <div className="px-2 lg:px-36 space-y-7">
      <Grid container className="p-3 shadow-lg">
        <Grid xs={12}>
          <p className="font-bold text-lg py-2">Delivery Address</p>
        </Grid>
        <Grid item xs={6}>
          {order?.order?.shippingAddress ? (
            <AddressCard address={order.order.shippingAddress} />
          ) : (
            <p className="text-gray-500">Address details not available</p>
          )}
        </Grid>
      </Grid>
      <Box className="p-5 shadow-lg border rounded-md">
        <Grid container sx={{ justifyContent: "space-between", alignItems: "center" }}>
          <Grid item xs={9}>
            <OrderTraker
              activeStep={
                order?.order?.orderStatus === "PLACED"
                  ? 1
                  : order?.order?.orderStatus === "CONFIRMED"
                  ? 2
                  : order?.order?.orderStatus === "SHIPPED"
                  ? 3
                  : 5
              }
            />
          </Grid>
          <Grid item>
            {order?.order?.orderStatus === "CANCELLED" && (
              <p className="text-red-500 font-bold">This order has been cancelled.</p>
            )}
            {order?.order?.orderStatus === "DELIVERED" && (
              <Button sx={{ color: "" }} color="error" variant="text">
                RETURN
              </Button>
            )}
            {order?.order?.orderStatus !== "DELIVERED" && (
              <Button
                sx={{ color: deepPurple[500] }}
                variant="text"
                onClick={() => setOpen(true)}
              >
                Cancel Order
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>
      <Grid container className="space-y-5">
        {order?.order?.orderItems?.length > 0 ? (
          order.order.orderItems.map((item) => (
            <Grid
              container
              item
              key={item.product.id}
              className="shadow-xl rounded-md p-5 border"
              sx={{ alignItems: "center", justifyContent: "space-between" }}
            >
              <Grid item xs={6}>
                <div className="flex items-center">
                  <img
                    className="w-[5rem] h-[5rem] object-cover object-top"
                    src={item.product.imageUrl}
                    alt=""
                  />
                  <div className="ml-5 space-y-2">
                    <p className="">{item.product.title}</p>
                    <p className="opacity-50 text-xs font-semibold space-x-5">
                      <span>Color: {item.color || "N/A"}</span>{" "}
                      <span>Size: {item.size || "N/A"}</span>
                    </p>
                    <p>Seller: {item.product.brand}</p>
                    <p>₹{item.price}</p>
                  </div>
                </div>
              </Grid>
              <Grid item>
                <Box
                  sx={{ color: deepPurple[500] }}
                  onClick={() => navigate(`/account/rate/${item.product.id}`)}
                  className="flex items-center cursor-pointer"
                >
                  <StarIcon
                    sx={{ fontSize: "2rem" }}
                    className="px-2 text-5xl"
                  />
                  <span>Rate & Review Product</span>
                </Box>
              </Grid>
            </Grid>
          ))
        ) : (
          <p className="text-gray-500">No items found for this order</p>
        )}
      </Grid>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="p-5 bg-white shadow-lg rounded-md max-w-md mx-auto mt-20">
          <Typography variant="h6" className="text-center">
            Confirm Cancellation
          </Typography>
          <Typography variant="body1" className="mt-3 text-center">
            Are you sure you want to cancel this order?
          </Typography>
          <div className="flex justify-between mt-5">
            <Button variant="outlined" onClick={() => setOpen(false)}>
              No
            </Button>
            <Button variant="contained" color="error" onClick={handleCancelOrder}>
              Yes, Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrderDetails;
