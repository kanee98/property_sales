import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import Link from 'next/link';
import Image from 'next/image';
import 'boxicons/css/boxicons.min.css';
import '../../components/dashboard.css';
import SidebarScript from "../../components/SidebarScript"; 
import { useEffect, useState } from "react";
import axios from "axios";
import { User } from "../api/users";

export default function PropertyDashboard() {
  const router = useRouter();
  const [activeListings, setActiveListings] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    axios.get("/api/properties")
      .then((response) => {
        setActiveListings(response.data.length); // Set the count dynamically
      })
      .catch((error) => console.error("Error fetching properties:", error));
  }, []);

  const fetchUsers = () => {
    axios.get("/api/users") // Assuming you have an API endpoint
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => console.error("Error fetching users:", error));
  };

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }
  
  return (  
    <>
      <SidebarScript /><div className={darkMode ? 'dark' : ''}>
        <section id="sidebar" className="sidebar">
          <Link href="#" className="brand">
            <i className='bx bxs-smile bx-lg'></i>
            <span className="text">AdminHub</span>
          </Link>
          <ul className="side-menu top">
            <li className={activeTab === "dashboard" ? "active" : ""}>
              <Link href="#" onClick={() => setActiveTab("dashboard")} className="nav-link">
                <i className='bx bxs-dashboard bx-sm'></i>
                <span className="text">Dashboard</span>
              </Link>
            </li>
            <li className={activeTab === "properties" ? "active" : ""}>
              <Link href="#" onClick={() => setActiveTab("properties")} className="nav-link">
                <i className='bx bxs-dashboard bx-sm'></i>
                <span className="text">Active Properties</span>
              </Link>
            </li>
            <li className={activeTab === "inquiries" ? "active" : ""}>
              <Link href="#" onClick={() => setActiveTab("inquiries")} className="nav-link">
                <i className='bx bxs-dashboard bx-sm'></i>
                <span className="text">Pending Inquiries</span>
              </Link>
            </li>
            <li className={activeTab === "users" ? "active" : ""}>
              <Link href="#" onClick={() => { setActiveTab("users"); fetchUsers(); }} className="nav-link">
                <i className='bx bxs-user bx-sm'></i>
                <span className="text">Users</span>
              </Link>
            </li>
          </ul>
          <ul className="side-menu bottom">
            <li>
              <Link href="#">
                <i className='bx bxs-cog bx-sm bx-spin-hover'></i>
                <span className="text">Settings</span>
              </Link>
            </li>
          </ul>
        </section>

        <section id="content">
          <nav className="navbar">
            <i className='bx bx-menu bx-sm'></i>
            <Link href="#" className="nav-link">Categories</Link>
            <div className="form-input">
              <input type="search" placeholder="Search..." />
              <button className="search-btn">
                <i className='bx bx-search'></i>
              </button>
            </div>
            {/* <label className="switch-lm">
              <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} hidden />
              <i className="bx bxs-moon"></i>
              <i className="bx bx-sun"></i>
              <div className="ball"></div>
            </label> */}
            <Link href="#" className="profile">
              <Image src="https://placehold.co/600x400/png" width={40} height={40} alt="Profile" />
            </Link>
            <li>
              <button className="logout" onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <i className='bx bx-power-off bx-sm bx-burst-hover'></i>
                {/* <span className="text">Logout</span> */}
              </button>
            </li>
          </nav>

          <main>
            {activeTab === "dashboard" && (
                <div className="head-title">
                  <h1>Dashboard</h1>
                  <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold">Total Users</h3>
                    <p className="text-3xl">{users.length}</p>
                    <h3 className="text-xl font-semibold">Active Listings</h3>
                    <p className="text-3xl">{activeListings}</p>
                    <h3 className="text-xl font-semibold">Pending Approvals</h3>
                    <p className="text-3xl">8</p>
                  </div>
                  <ul className="breadcrumb">
                    <li>
                      <Link href="#">Dashboard</Link>
                    </li>
                    <li><i className='bx bx-chevron-right'></i></li>
                    <li>
                      <Link href="#" className="active">Home</Link>
                    </li>
                  </ul>
                </div>
              )}

              {activeTab === "users" && (
                <div className="p-6">
                  <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
                  <table className="w-full border border-gray-300">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="py-2 px-4">ID</th>
                        <th className="py-2 px-4">Name</th>
                        <th className="py-2 px-4">Email</th>
                        <th className="py-2 px-4">Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length > 0 ? (
                        users.map((user) => (
                          <tr key={user.id} className="border-t">
                            <td className="py-2 px-4">{user.id}</td>
                            <td className="py-2 px-4">{user.name}</td>
                            <td className="py-2 px-4">{user.email}</td>
                            <td className="py-2 px-4">{user.role}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-4 text-center">No users found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
          </main>
        </section>
      </div></>
    
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