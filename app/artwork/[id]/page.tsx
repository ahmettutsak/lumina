"use client";

import { Suspense } from "react";
import ArtworkDetails from "./ArtworkDetails";

function ArtworkPage({ params }: any) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ArtworkDetails id={params.id} />
    </Suspense>
  );
}

export default ArtworkPage;
