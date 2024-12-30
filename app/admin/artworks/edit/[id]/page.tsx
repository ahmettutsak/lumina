"use client";

import { Suspense } from "react";
import EditArtworkForm from "./EditArtworkForm";

function EditArtworkPage({ params }: any) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditArtworkForm id={params.id} />
    </Suspense>
  );
}

export default EditArtworkPage;
