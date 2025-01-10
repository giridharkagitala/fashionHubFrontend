import React, { useState } from "react";
import { Badge, Button, Modal, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import CartItem from "../Cart/CartItem";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrderById, cancelOrder } from "../../../Redux/Customers/Order/Action";
import AddressCard from "../adreess/AdreessCard";
import { createPayment } from "../../../Redux/Customers/Payment/Action";
import { toast } from "react-toastify";

const OrderSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get("order_id");
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { order } = useSelector((state) => state);

  const [open, setOpen] = useState(false); // State for modal

  useEffect(() => {
    dispatch(getOrderById(orderId));
  }, [orderId]);

  const handleCreatePayment = () => {
    const data = { orderId: order.order?.id, jwt };
    dispatch(createPayment(data));
  };

  const handleCancelOrder = () => {
    dispatch(cancelOrder({ orderId, jwt }));
    setOpen(false);
  
    // Display success toast notification
    toast.success("Order cancelled successfully!");
  
    // Redirect after a short delay
    setTimeout(() => {
      navigate("/account/order");
    }, 500);
  };
  

  return (
    <div className="space-y-5">
      <div className="p-5 shadow-lg rounded-md border">
        <AddressCard address={order.order?.shippingAddress} />
        {order.order?.orderStatus === "CANCELLED" && (
          <p className="text-red-500 font-bold mt-3">This order has been cancelled.</p>
        )}
      </div>
      <div className="lg:grid grid-cols-3 relative justify-between">
        <div className="lg:col-span-2">
          <div className="space-y-3">
            {order.order?.orderItems.map((item) => (
              <CartItem key={item.id} item={item} showButton={false} />
            ))}
          </div>
        </div>
        <div className="sticky top-0 h-[100vh] mt-5 lg:mt-0 ml-5">
          <div className="border p-5 bg-white shadow-lg rounded-md">
            <p className="font-bold opacity-60 pb-4">PRICE DETAILS</p>
            <hr />
            <div className="space-y-3 font-semibold">
              <div className="flex justify-between pt-3 text-black">
                <span>Price ({order.order?.totalItem} item)</span>
                <span>₹{order.order?.totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span className="text-green-700">-₹{order.order?.discounte}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="text-green-700">Free</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-lg">
                <span>Total Amount</span>
                <span className="text-green-700">
                  ₹{order.order?.totalDiscountedPrice}
                </span>
              </div>
            </div>
            <Button
              onClick={handleCreatePayment}
              variant="contained"
              sx={{ padding: ".8rem 2rem", marginTop: "2rem", width: "100%" }}
            >
              Payment
            </Button>
            {order.order?.orderStatus !== "CANCELLED" && (
              <Button
                onClick={() => setOpen(true)} // Open the cancel confirmation modal
                variant="outlined"
                color="error"
                sx={{ padding: ".8rem 2rem", marginTop: "1rem", width: "100%" }}
              >
                Cancel Order
              </Button>
            )}
          </div>
        </div>
      </div>
      {/* Cancel Order Confirmation Modal */}
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

export default OrderSummary;
