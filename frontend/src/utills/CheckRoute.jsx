import React from "react";
import { Navigate } from "react-router-dom";

const CheckRoute = ({ userData }) => {
  if (userData !== null && userData !== undefined) {
    return <Navigate to="/home" />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default CheckRoute;
