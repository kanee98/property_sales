import AdminSidebar from "../../components/AdminSidebar";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import { useState } from "react";
import AdminListings from "../admin/AdminListings";

export default function Dashboard() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const [selectedTab, setSelectedTab] = useState("dashboard");

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-6">
        {/* Navigation Tabs */}
        <div className="flex space-x-4 mt-4">
          <button onClick={() => setSelectedTab("dashboard")} className={`px-4 py-2 rounded ${selectedTab === "dashboard" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
            Dashboard
          </button>
          <button onClick={() => setSelectedTab("listings")} className={`px-4 py-2 rounded ${selectedTab === "listings" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
            Manage Listings
          </button>
        </div>
        <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">Total Users</h3>
            <p className="text-3xl">120</p>
          </div>
          <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">Active Listings</h3>
            <p className="text-3xl">45</p>
          </div>
          <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">Pending Approvals</h3>
            <p className="text-3xl">8</p>
          </div>
        </div>
        {/* Content Area */}
        <div className="mt-6">
          {selectedTab === "dashboard"}
          {selectedTab === "listings" && <AdminListings />}
        </div>
      </div>
    </div>
  );
}

// Protect route with getServerSideProps
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = parseCookies(ctx);
  if (!cookies.adminToken) {
    return { redirect: { destination: "/admin/login", permanent: false } };
  }
  return { props: {} };
};