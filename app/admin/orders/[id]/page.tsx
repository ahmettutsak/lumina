"use client";

import { Suspense } from "react";
import OrderDetails from "./OrderDetails";

function OrderPage({ params }: any) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderDetails id={params.id} />
    </Suspense>
  );
}

export default OrderPage;
