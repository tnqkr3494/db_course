import React from "react";
import { useLocation } from "react-router-dom";

const Buy = () => {
  const location = useLocation();
  const message = location.state?.message;

  return (
    <div>
      <h1>Buy Ticket</h1>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Buy;
