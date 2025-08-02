import FooterHome from "@/components/FooterHome";
import NavbarHome from "@/components/NavbarHome";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarHome />
      <main>{children}</main>
      <FooterHome />
    </>
  );
}
