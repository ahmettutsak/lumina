"use client";

import { Suspense } from "react";
import CheckoutForm from "./CheckoutForm";

function CheckoutPage({ params }: any) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutForm artworkId={params.artwork_id} />
    </Suspense>
  );
}

export default CheckoutPage;
