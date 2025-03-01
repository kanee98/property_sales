// import AdminSidebar from "../../components/AdminSidebar";
// import { GetServerSideProps } from "next";
// import { parseCookies } from "nookies";
// import { useRouter } from "next/router";
// import { useState } from "react";
// import AdminListings from "../admin/AdminListings";

// export default function Dashboard() {
//   const router = useRouter();

//   async function handleLogout() {
//     await fetch("/api/auth/logout", { method: "POST" });
//     router.push("/admin/login");
//   }

//   const [selectedTab, setSelectedTab] = useState("dashboard");

//   return (
//     <div className="flex min-h-screen">
//       <AdminSidebar />
//       <div className="flex-1 p-6">
//         {/* Navigation Tabs */}
//         <div className="flex space-x-4 mt-4">
//           <button onClick={() => setSelectedTab("dashboard")} className={`px-4 py-2 rounded ${selectedTab === "dashboard" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
//             Dashboard
//           </button>
//           <button onClick={() => setSelectedTab("listings")} className={`px-4 py-2 rounded ${selectedTab === "listings" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
//             Manage Listings
//           </button>
//         </div>
//         <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
//         <div className="grid grid-cols-3 gap-6">
//           <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg">
//             <h3 className="text-xl font-semibold">Total Users</h3>
//             <p className="text-3xl">120</p>
//           </div>
//           <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg">
//             <h3 className="text-xl font-semibold">Active Listings</h3>
//             <p className="text-3xl">45</p>
//           </div>
//           <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-lg">
//             <h3 className="text-xl font-semibold">Pending Approvals</h3>
//             <p className="text-3xl">8</p>
//           </div>
//         </div>
//         {/* Content Area */}
//         <div className="mt-6">
//           {selectedTab === "dashboard"}
//           {selectedTab === "listings" && <AdminListings />}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Protect route with getServerSideProps
// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const cookies = parseCookies(ctx);
//   if (!cookies.adminToken) {
//     return { redirect: { destination: "/admin/login", permanent: false } };
//   }
//   return { props: {} };
// };

import AdminSidebar from "../../components/AdminSidebar";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import AdminListings from "../admin/AdminListings";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";

export default function PropertyDashboard() {
  const [properties, setProperties] = useState([
    { id: 1, name: "Luxury Villa", location: "New York, NY", images: 5 },
    { id: 2, name: "Modern Apartment", location: "Los Angeles, CA", images: 3 },
  ]);

  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (  
    <div className="p-6 space-y-6">
      <AdminSidebar />
      <div className="flex-1 p-6">
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
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Property Management</h1>
        <Dialog>
          <DialogTrigger>
            <Button>Add New Property</Button>
          </DialogTrigger>
          <DialogContent>
            <h2 className="text-xl font-semibold">Create New Property</h2>
            <Input placeholder="Property Name" />
            <Input placeholder="Location" />
            <Textarea placeholder="Description" />
            <Button className="flex items-center gap-2">
              <Upload size={16} /> Upload Images
            </Button>
            <Button>Create Property</Button>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Images</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>{property.name}</TableCell>
                  <TableCell>{property.location}</TableCell>
                  <TableCell>{property.images} images</TableCell>
                  <TableCell className="space-x-2">
                    <Button variant="outline">Edit</Button>
                    <Button variant="destructive">Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}