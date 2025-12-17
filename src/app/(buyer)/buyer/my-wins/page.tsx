import { Suspense } from "react";
import MyWinsPageContent from "./MyWinsPageContent";

export default function MyWinsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyWinsPageContent />
    </Suspense>
  );
}