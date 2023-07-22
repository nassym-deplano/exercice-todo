import React from "react";

import $ from "./Address.module.css";

const Address = ({ address }) => {
  return (
    <address className={$.address}>
      {address.houseNumber} {address.street}, {address.postcode} {address.city}
    </address>
  );
};

export default Address;
