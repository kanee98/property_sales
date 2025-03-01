import Link from "next/link";
import { useRouter } from "next/router";
import { LayoutDashboard, Users, LogOut } from "lucide-react";

export default function AdminSidebar() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="h-screen w-64 bg-gray-900 text-white p-4 flex flex-col">
      <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
      <nav className="flex flex-col gap-4 flex-grow">
        <Link href="/admin/dashboard" className="flex items-center gap-2 hover:text-gray-300">
          <LayoutDashboard className="w-5 h-5" /> Dashboard
        </Link>
        <Link href="/admin/users" className="flex items-center gap-2 hover:text-gray-300">
          <Users className="w-5 h-5" /> Users
        </Link>
        <Link href="/admin/AdminListings" className="flex items-center gap-2 hover:text-gray-300">
          <Users className="w-5 h-5" /> Properties
        </Link>
      </nav>
      <button onClick={handleLogout} className="mt-auto flex items-center gap-2 bg-red-600 px-4 py-2 rounded">
        <LogOut className="w-5 h-5" /> Logout
      </button>
    </div>
  );
}
