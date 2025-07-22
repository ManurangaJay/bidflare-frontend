import React from "react";
import NavbarSeller from "@/components/NavbarSeller";
import FooterSeller from "@/components/FooterSeller";

export const metadata = {
  title: "BidFlare Seller",
  description: "Manage and sell your products on BidFlare",
};

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarSeller />
      <main className="pt-4">{children}</main>
      <FooterSeller />
    </>
  );
}
