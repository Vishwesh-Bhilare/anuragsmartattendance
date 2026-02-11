iimport { Suspense } from "react";
import ScanClient from "./scan-client";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading scanner...</div>}>
      <ScanClient />
    </Suspense>
  );
}

