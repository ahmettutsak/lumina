"use client";

import { Suspense } from "react";
import UserDetails from "./UserDetails";

function UserPage({ params }: any) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserDetails id={params.id} />
    </Suspense>
  );
}

export default UserPage;
