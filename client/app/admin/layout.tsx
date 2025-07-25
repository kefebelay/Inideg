import { Ubuntu } from "next/font/google";
import Sidebar from "@/components/admin/sidebar";
import RouteGuard from "@/components/RouteGuard";

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
      <RouteGuard>
        <Sidebar>{children}</Sidebar>
      </RouteGuard>
    </div>
  );
}
