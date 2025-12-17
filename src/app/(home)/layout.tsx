import FooterHome from "@/components/FooterHome";
import NavbarHome from "@/components/NavbarHome";

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
