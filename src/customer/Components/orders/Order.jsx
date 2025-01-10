import { Box, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import OrderCard from "./OrderCard";
import { useDispatch, useSelector } from "react-redux";
import { getOrderHistory } from "../../../Redux/Customers/Order/Action";

const orderStatusOptions = [
  { label: "On The Way", value: "ON_THE_WAY" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Returned", value: "RETURNED" },
];

const statusPriority = {
  "SHIPPED": 1,
  "OUT_FOR_DELIVERY": 2,
  "ON_THE_WAY": 3,
  "DELIVERED": 4,
  "CANCELLED": 5,
  "RETURNED": 6,
};

const Order = () => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { order } = useSelector((store) => store);

  const [selectedStatuses, setSelectedStatuses] = useState([]);

  useEffect(() => {
    dispatch(getOrderHistory({ jwt }));
  }, [jwt]);

  //useEffect(() => {
  //  setSelectedStatuses(order.orders);
  //}, []);


console.log(order,"Order Number ");
  const handleFilterChange = (event) => {
    const { value, checked } = event.target;
    console.log("nssjksnjk");

    setSelectedStatuses((prevStatuses) =>
      checked
        ? [...prevStatuses, value]
        : prevStatuses.filter((status) => status !== value)
    );
  };

  // Filter and sort orders
  const filteredOrders =
    selectedStatuses.length > 0
      ? order.orders
        ?.filter((o) => selectedStatuses.includes(o.orderStatus))
        ?.sort(
          (a, b) => statusPriority[a.orderStatus] - statusPriority[b.orderStatus]
        )
      : order.orders;

  //console.log(filteredOrders,"Filtered Orders");

  // Add a check for canceled orders specifically
  const canceledOrders = filteredOrders?.filter(
    (order) => order.orderStatus === "CANCELLED"
  );

  return (
    <Box className="px-10">
      <Grid container spacing={0} sx={{ justifyContent: "space-between" }}>
        <Grid item xs={2.5} className="">
          <div className="h-auto shadow-lg bg-white border p-5 sticky top-5">
            <h1 className="font-bold text-lg">Filters</h1>
            <div className="space-y-4 mt-10">
              <h1 className="font-semibold">ORDER STATUS</h1>
              {orderStatusOptions.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    type="checkbox"
                    value={option.value}
                    onChange={handleFilterChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label className="ml-3 text-sm text-gray-600">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </Grid>
        <Grid item xs={9}>
          <Box className="space-y-5">
            {filteredOrders?.length > 0 ? (
              filteredOrders.map((order) =>
                order?.orderItems?.map((item, index) => (
                  <OrderCard item={item} order={order} key={index} />
                ))
              )
            ) : (
              <p>No orders found for the selected status.</p>
            )}

            {canceledOrders?.length > 0 && (
              <>
                <h2 className="font-bold text-lg mt-5">Cancelled Orders</h2>
                {canceledOrders.map((order) =>
                  order.orderItems.map((item, index) => (
                    <OrderCard key={index} item={item} order={order} />
                  ))
                )}
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Order;
