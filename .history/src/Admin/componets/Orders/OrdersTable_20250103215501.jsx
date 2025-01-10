import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  confirmOrder,
  deleteOrder,
  deliveredOrder,
  getOrders,
  shipOrder,
} from "../../../Redux/Admin/Orders/Action";

const OrdersTable = () => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { adminsOrder } = useSelector((store) => store);

  const [anchorElArray, setAnchorElArray] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(""); // State for selected filter

  useEffect(() => {
    dispatch(getOrders({ jwt })); // Fetch all orders
  }, [jwt, adminsOrder.delivered, adminsOrder.shipped, adminsOrder.confirmed]);

  // Filter orders dynamically based on selectedStatus state
  const filteredOrdersOrg = selectedStatus
    ? adminsOrder.orders.filter((order) => order.orderStatus === selectedStatus)
    : adminsOrder.orders;

  const filteredOrders = selectedStatus
    ? (adminsOrder.orders || []).filter((order) => order.orderStatus === selectedStatus)
    : adminsOrder.orders || [];

  const handleUpdateStatusMenuClick = (event, index) => {
    const newAnchorElArray = [...anchorElArray];
    newAnchorElArray[index] = event.currentTarget;
    setAnchorElArray(newAnchorElArray);
  };

  const handleUpdateStatusMenuClose = (index) => {
    const newAnchorElArray = [...anchorElArray];
    newAnchorElArray[index] = null;
    setAnchorElArray(newAnchorElArray);
  };

  const handleConfirmedOrder = (orderId, index) => {
    handleUpdateStatusMenuClose(index);
    dispatch(confirmOrder(orderId));
  };

  const handleShippedOrder = (orderId, index) => {
    handleUpdateStatusMenuClose(index);
    dispatch(shipOrder(orderId));
  };

  const handleDeliveredOrder = (orderId, index) => {
    handleUpdateStatusMenuClose(index);
    dispatch(deliveredOrder(orderId));
  };

  const handleDeleteOrder = (orderId) => {
    handleUpdateStatusMenuClose();
    dispatch(deleteOrder(orderId));
  };

  const handleStatusFilterChange = (status) => {
    setSelectedStatus(status); // Update selected status
  };

  return (
    <Box>
      <Card className="mt-2">
        <CardHeader
          title="All Orders"
          sx={{
            pt: 2,
            alignItems: "center",
            "& .MuiCardHeader-action": { mt: 0.6 },
          }}
          action={
            <div className="flex space-x-4">
              {["On The Way", "Delivered", "Cancelled", "Returned"].map(
                (status) => (
                  <FormControlLabel
                    key={status}
                    control={
                      <Checkbox
                        checked={selectedStatus === status.toUpperCase()}
                        onChange={() =>
                          handleStatusFilterChange(
                            selectedStatus === status.toUpperCase()
                              ? ""
                              : status.toUpperCase()
                          )
                        }
                        color="primary"
                      />
                    }
                    label={status}
                  />
                )
              )}
            </div>
          }
        />
        <TableContainer>
          <Table sx={{ minWidth: 800 }} aria-label="table in dashboard">
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Id</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Status</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Update</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders?.map((item, index) => (
                <TableRow
                  hover
                  key={item.id}
                  sx={{ "&:last-of-type td, &:last-of-type th": { border: 0 } }}
                >
                  <TableCell>
                    <AvatarGroup max={4} sx={{ justifyContent: "start" }}>
                      {item.orderItems.map((orderItem) => (
                        <Avatar
                          key={orderItem.product.id}
                          alt={item.title}
                          src={orderItem.product.imageUrl}
                        />
                      ))}
                    </AvatarGroup>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          fontSize: "0.875rem !important",
                        }}
                      >
                        {item?.orderItems.map((order) => (
                          <span key={order.product.id}> {order.product.title},</span>
                        ))}
                      </Typography>
                      <Typography variant="caption">
                        {item?.orderItems.map((order) => (
                          <span
                            key={`${order.product.id}-brand`}
                            className="opacity-60"
                          >
                            {" "}
                            {order.product.brand},
                          </span>
                        ))}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{item.totalPrice}</TableCell>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>
                    <Chip
                      sx={{
                        color: "white !important",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                      label={item.orderStatus}
                      size="small"
                      color={
                        item.orderStatus === "PENDING"
                          ? "info"
                          : item.orderStatus === "DELIVERED"
                          ? "success"
                          : item.orderStatus === "CANCELLED"
                          ? "error"
                          : item.orderStatus === "ON THE WAY"
                          ? "primary"
                          : "secondary"
                      }
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Button
                      id={`basic-button-${item.id}`}
                      aria-controls={`basic-menu-${item.id}`}
                      aria-haspopup="true"
                      aria-expanded={Boolean(anchorElArray[index])}
                      onClick={(event) =>
                        handleUpdateStatusMenuClick(event, index)
                      }
                    >
                      Status
                    </Button>
                    <Menu
                      id={`basic-menu-${item.id}`}
                      anchorEl={anchorElArray[index]}
                      open={Boolean(anchorElArray[index])}
                      onClose={() => handleUpdateStatusMenuClose(index)}
                      MenuListProps={{
                        "aria-labelledby": `basic-button-${item.id}`,
                      }}
                    >
                      <MenuItem
                        onClick={() => handleConfirmedOrder(item.id, index)}
                        disabled={
                          item.orderStatus === "DELIVERED" ||
                          item.orderStatus === "SHIPPED" ||
                          item.orderStatus === "CONFIRMED"
                        }
                      >
                        CONFIRMED ORDER
                      </MenuItem>
                      <MenuItem
                        disabled={
                          item.orderStatus === "DELIVERED" ||
                          item.orderStatus === "SHIPPED"
                        }
                        onClick={() => handleShippedOrder(item.id, index)}
                      >
                        SHIPPED ORDER
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleDeliveredOrder(item.id, index)}
                      >
                        DELIVERED ORDER
                      </MenuItem>
                    </Menu>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Button
                      onClick={() => handleDeleteOrder(item.id)}
                      variant="text"
                    >
                      delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default OrdersTable;
