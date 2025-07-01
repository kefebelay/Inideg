import { Ubuntu } from "next/font/google";
import Sidebar from "@/components/admin/sidebar";

const ubuntu = Ubuntu({
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={ubuntu.className}>
      <Sidebar>{children}</Sidebar>
    </div>
  );
}
