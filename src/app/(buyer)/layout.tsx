import React from "react";
import NavbarBuyer from "@/components/NavbarBuyer";
import FooterBuyer from "@/components/FooterBuyer";

export const metadata = {
  title: "BidFlare Buyer",
  description: "Browse and bid on amazing items at BidFlare",
};

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarBuyer />
      <main className="pt-4">{children}</main>
      <FooterBuyer />
    </>
  );
}
