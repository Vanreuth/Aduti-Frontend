
import { Suspense } from "react";
import {
  ShopLoading,
  ShopContent
} from "@/components/shop";


export default function ShopPage() {
  return (
    <Suspense
      fallback={<ShopLoading />}
    >
      <ShopContent />
    </Suspense>
  );
}
