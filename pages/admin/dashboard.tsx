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
import Logo from "../../src/img/Prime Ceylon Logo No BG.png";

interface Property {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  latitude: number;
  longitude: number;
  type: string;
}

const itemsPerPage = 6;

export default function PropertyDashboard() {
  const router = useRouter();
  const [activeListings, setActiveListings] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch("/api/properties");
      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }
      const data: Property[] = await response.json();
      setProperties(data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

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

  useEffect(() => {
    const storedTheme = localStorage.getItem("darkMode") === "true";
    setDarkMode(storedTheme);
  }, []);
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);
  
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Track the current page

  // Filter properties based on search term
  const filteredProperties = properties.filter(property =>
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.description.toLowerCase().includes(searchTerm.toLowerCase()) // You can add more search criteria here
  );

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate the start and end indices for slicing the properties array
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const usersToDisplay = filteredUsers.slice(startIndex, endIndex);

  const propertiesToDisplay = filteredProperties.slice(startIndex, endIndex);

  const totalPagesForUsers = Math.ceil(filteredUsers.length / itemsPerPage);
  const totalPagesForProperties = Math.ceil(filteredProperties.length / itemsPerPage);

  // Handle page change for both users and properties
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPagesForProperties) {
      setCurrentPage(page);
    }
  };

  // Example handlers for Edit and Delete
  const handleEdit = (id: number) => {
    console.log("Edit property with ID:", id);
    // Perform the edit action here (e.g., show a modal to edit the property)
  };

  const handleDelete = (id: number) => {
    console.log("Delete property with ID:", id);
    // Perform the delete action here (e.g., remove from the properties array)
  };
  
  return (  
    <>
      <SidebarScript /><div className={darkMode ? 'dark' : ''}>
        <section id="sidebar" className="sidebar">
          <Link href="#" className="brand">
            {/* <i className='bx bxs-smile bx-lg'></i> */}
            <Image src={Logo} width={60} height={60} alt="Logo" className="logo-image" />
            <span className="text" style={{ color: "gray", paddingLeft: "5%"}}>Prime Ceylon</span>
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
            {/* <li>
              <Link href="#">
                <i className='bx bxs-cog bx-sm bx-spin-hover'></i>
                <span className="text">Settings</span>
              </Link>
            </li> */}
            <li>
              <a href="/login" onClick={handleLogout} className="logout">
                <i className='bx bx-power-off bx-sm bx-burst-hover' ></i>
                <span className="text">Logout</span>
              </a>
            </li>
          </ul>
        </section>

        <section id="content">
          <nav className="navbar">
            <i className='bx bx-menu bx-sm'></i>
            {/* <Link href="#" className="nav-link">Categories</Link> */}
            <form action="">
              <div className="form-input">
                 <input 
                  type="search" 
                  placeholder="Search..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                {/* <button className="search-btn">
                  <i className='bx bx-search'></i>
                </button> */}
              </div>
            </form>
            <input type="checkbox" className="checkbox" id="switch-mode" hidden />
            <label className="swith-lm" htmlFor="switch-mode" onClick={toggleDarkMode}>
              <i className="bx bxs-moon"></i>
              <i className="bx bx-sun"></i>
              <div className="ball"></div>
            </label>
            {/* <li>
              <button className="logout nav-link" onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <i className='bx bx-power-off bx-sm bx-burst-hover'></i>
                <span className="text">Logout</span>
              </button>
            </li> */}

            {/* Notification Bell */}
            <a href="#" className="notification" id="notificationIcon">
                <i className='bx bxs-bell bx-tada-hover' ></i>
                <span className="num">8</span>
            </a>
            <div className="notification-menu" id="notificationMenu">
                <ul>
                    <li>New message from John</li>
                    <li>Your order has been shipped</li>
                    <li>New comment on your post</li>
                    <li>Update available for your app</li>
                    <li>Reminder: Meeting at 3PM</li>
                </ul>
            </div>

            {/* Profile Menu */}
            <Link href="#" className="profile">
              <Image src="https://placehold.co/600x400/png" width={40} height={40} alt="Profile" />
            </Link>
            <div className="profile-menu" id="profileMenu">
                <ul>
                    <li><a href="#">My Profile</a></li>
                    {/* <li><a href="#">Settings</a></li> */}
                    <li><a href="/login" onClick={handleLogout}>Log Out</a></li>
                </ul>
            </div>
          </nav>

          <main>
            {activeTab === "dashboard" && (
              <>
                <div className="head-title">
                  <div className="left">
                    <h1>Dashboard</h1>
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
                  {/* <a href="#" className="btn-download">
                    <i className='bx bxs-cloud-download bx-fade-down-hover' ></i>
                    <span className="text">Get PDF</span>
                  </a>           */}
                </div>
                <ul className="box-info">
                  <li>
                    <i className='bx bxs-calendar-check' ></i>
                    <span className="text">
                      <h3>Active Listings</h3>
                      <p>{activeListings}</p>
                    </span>
                  </li>
                  <li>
                    <i className='bx bxs-dollar-circle' ></i>
                    <span className="text">
                      <h3>Pending Approvals</h3>
                      <p>1</p>
                    </span>
                  </li>
                  <li>
                    <i className='bx bxs-group' ></i>
                    <span className="text">
                      <h3>Total Users</h3>
                      <p>{users.length}</p>
                    </span>
                  </li>
                </ul>
                <div className="table-data">
                  <div className="todo">
                    <div className="head">
                      <h3>Todos</h3>
                      <i className='bx bx-plus icon'></i>
                      {/* <i className='bx bx-filter' ></i> */}
                    </div>
                    <ul className="todo-list">
                      <li className="completed">
                        <p>Check Inventory</p>
                        <i className='bx bx-dots-vertical-rounded' ></i>
                      </li>
                      <li className="completed">
                        <p>Manage Delivery Team</p>
                        <i className='bx bx-dots-vertical-rounded' ></i>
                      </li>
                      <li className="not-completed">
                        <p>Contact Selma: Confirm Delivery</p>
                        <i className='bx bx-dots-vertical-rounded' ></i>
                      </li>
                      <li className="completed">
                        <p>Update Shop Catalogue</p>
                        <i className='bx bx-dots-vertical-rounded' ></i>
                      </li>
                      <li className="not-completed">
                        <p>Count Profit Analytics</p>
                        <i className='bx bx-dots-vertical-rounded' ></i>
                      </li>
                    </ul>
                  </div>
                </div>
              </>
              )}

              {activeTab === "properties" && (
                <div className="p-6">
                  <div className="table-data">
                    <div className="order">
                    <div className="head">
                      <h3>Properties List</h3>
                      <i className='bx bx-plus icon'></i>
                    </div>
                      <table>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Type</th>
                            {/* <th>Image</th> */}
                            <th>Actions</th> 
                          </tr>
                        </thead>
                        <tbody>
                          {propertiesToDisplay.length > 0 ? (
                            propertiesToDisplay.map((property) => (
                              <tr key={property.id}>
                                <td>{property.id}</td>
                                <td>{property.name}</td>
                                <td>{property.description}</td>
                                <td>${property.price.toLocaleString()}</td>
                                <td>{property.type}</td>
                                {/* <td>
                                  <img src={property.image} alt={property.name} width="100" />
                                </td> */}
                                <td>
                                  {/* Edit and Delete buttons */}
                                  <button
                                    onClick={() => handleEdit(property.id)}
                                    className="edit-btn"
                                    style={{ marginRight: '10px' }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDelete(property.id)}
                                    className="delete-btn"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))
                            ): (
                              <tr>
                                <td colSpan={4} className="py-4 text-center">No properties found</td>
                              </tr>
                          )}
                        </tbody>
                      </table>
                      {/* Pagination Controls */}
                      <div className="pagination-controls">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="pagination-btn"
                        >
                          « Previous
                        </button>

                        <span>Page {currentPage} of {totalPagesForProperties}</span>

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPagesForProperties}
                          className="pagination-btn"
                        >
                          Next »
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "users" && (
                <div className="p-6">
                  <div className="table-data">
                    <div className="order">
                      <div className="head">
                        <h3>Manage Users</h3>
                        <i className='bx bx-plus icon'></i>
                      </div>
                      <table>
                        <thead>
                          <tr>
                            <th className="py-2 px-4"></th>
                            <th className="py-2 px-4">ID</th>
                            <th className="py-2 px-4">Name</th>
                            <th className="py-2 px-4">Email</th>
                            <th className="py-2 px-4">Role</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {usersToDisplay.length > 0 ? (
                            usersToDisplay.map((user) => (
                              <tr key={user.id} className="border-t">
                                <Image src="https://placehold.co/600x400/png" width={40} height={40} alt="Profile"/>
                                <td className="py-2 px-4">{user.id}</td>
                                <td className="py-2 px-4">{user.name}</td>
                                <td className="py-2 px-4">{user.email}</td>
                                <td className="py-2 px-4">{user.role}</td>
                                <td>
                                  {/* Edit and Delete buttons */}
                                  <button
                                    onClick={() => handleEdit(user.id)}
                                    className="edit-btn"
                                    style={{ marginRight: '10px' }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDelete(user.id)}
                                    className="delete-btn"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="py-4 text-center">No users found</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                      {/* Pagination Controls */}
                      <div className="pagination-controls">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="pagination-btn"
                        >
                          « Previous
                        </button>

                        <span>Page {currentPage} of {totalPagesForUsers}</span>

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPagesForUsers}
                          className="pagination-btn"
                        >
                          Next »
                        </button>
                      </div>
                    </div>
                  </div>
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