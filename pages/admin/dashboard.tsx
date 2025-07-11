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
import Logo from "../../src/img/Propwise Logo No BG.png";

interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  latitude: number;
  longitude: number;
  category: string;
  district: string;
  type: string;
  manager: string;
  contact: number;
}

export interface Inquiry {
  id: number;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  requirements: string;
  budget?: number;
  attachments?: any; // You can make this `string[]` if it's always an array of files
  createdAt: string; // or Date depending on how you handle it
  status: number;
}

const itemsPerPage = 6;

export default function PropertyDashboard() {
  const router = useRouter();
  const [activeListings, setActiveListings] = useState(0);
  const [activeInquiries, setActiveInquiries] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [properties, setProperties] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

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

  useEffect(() => {
    axios.get("/api/inquiries")
      .then((response) => {
        setActiveInquiries(response.data.length); // Set the count dynamically
        setInquiries(response.data);
      })
      .catch((error) => console.error("Error fetching inquiries:", error));
  }, []);

  useEffect(() => {
    fetchUsers(); 
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users"); 
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
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
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.type.toLowerCase().includes(searchTerm.toLowerCase()) // You can add more search criteria here
  );

  // Filter inquires based on search term
  const filteredInquiries = inquiries.filter(inquiry =>
    inquiry.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.requirements.toLowerCase().includes(searchTerm.toLowerCase())
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
  const inquiriesToDisplay = filteredInquiries.slice(startIndex, endIndex);

  const totalPagesForUsers = Math.ceil(filteredUsers.length / itemsPerPage);
  const totalPagesForProperties = Math.ceil(filteredProperties.length / itemsPerPage);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Handle page change for both users and properties
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPagesForProperties) {
      setCurrentPage(page);
    }
  };

  // Handle Edit
  const handleEdit = (propertyId: number) => {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      setEditingProperty(property);
      setIsEditModalOpen(true);
    }
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
            <span className="text" style={{ color: "gray", paddingLeft: "5%"}}>Propwise</span>
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
              <i className="bx bx-sun"></i>
              <i className="bx bxs-moon"></i>
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
                      <p>{activeInquiries}</p>
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
                  <div className="head-title">
                    <div className="left">
                      <h1>Properties</h1>
                      <ul className="breadcrumb">
                        <li>
                          <Link href="#">Properties</Link>
                        </li>
                        <li><i className='bx bx-chevron-right'></i></li>
                        <li>
                          <Link href="#" className="active">Active Properties</Link>
                        </li>
                      </ul>
                    </div>
                  </div>

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
                            <th>Title</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Manager</th>
                            <th>Contact Number</th>
                            <th>District</th>
                            <th>Type</th>
                            <th>Actions</th> 
                          </tr>
                        </thead>
                        <tbody>
                          {propertiesToDisplay.length > 0 ? (
                            propertiesToDisplay.map((property) => (
                              <tr key={property.id}>
                                <td>{property.id}</td>
                                <td>{property.title}</td>
                                <td>{property.description}</td>
                                <td>
                                  {property.price != null
                                    ? `Rs. ${property.price.toLocaleString()}`
                                    : "N/A"}
                                </td>
                                <td>{property.category}</td>
                                <td>{property.manager}</td>
                                <td>{property.contact}</td>
                                <td>{property.district}</td>
                                <td>{property.type}</td>
                                <td>
                                <button
                                    onClick={() => {
                                      setEditingProperty(property);
                                      setIsEditModalOpen(true);
                                    }}
                                    className="edit-btn"
                                    style={{ marginRight: "10px" }}
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
                          ) : (
                            <tr>
                              <td colSpan={6} className="py-4 text-center">
                                No properties found
                              </td>
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
                  {isEditModalOpen && editingProperty && (
                    <div className="table-data">
                    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
                      <div className="bg-white rounded-lg shadow-xl p-6 w-[90%] max-w-3xl">
                        <h2 className="text-2xl font-semibold mb-4">Edit Property</h2>

                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            try {
                              const res = await fetch("/api/properties", {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(editingProperty),
                              });

                              if (res.ok) {
                                const updated = await res.json();
                                setProperties((prev) =>
                                  prev.map((p) => (p.id === updated.id ? updated : p))
                                );
                                setIsEditModalOpen(false);
                              } else {
                                const err = await res.json();
                                alert("Update failed: " + err.message);
                              }
                            } catch (err) {
                              console.error(err);
                              alert("Something went wrong");
                            }
                          }}
                        >
                          <div className="grid grid-cols-2 gap-4">
                            <input
                              type="text"
                              placeholder="Title"
                              value={editingProperty.title}
                              onChange={(e) => setEditingProperty({ ...editingProperty, title: e.target.value })}
                              required
                              className="border p-2 rounded"
                            />
                            <input
                              type="text"
                              placeholder="Category"
                              value={editingProperty.category}
                              onChange={(e) => setEditingProperty({ ...editingProperty, category: e.target.value })}
                              required
                              className="border p-2 rounded"
                            />
                            <input
                              type="number"
                              placeholder="Price"
                              value={editingProperty.price ?? ""}
                              onChange={(e) => setEditingProperty({ ...editingProperty, price: Number(e.target.value) })}
                              className="border p-2 rounded"
                            />
                            <input
                              type="text"
                              placeholder="District"
                              value={editingProperty.district}
                              onChange={(e) => setEditingProperty({ ...editingProperty, district: e.target.value })}
                              className="border p-2 rounded"
                            />
                            <input
                              type="text"
                              placeholder="Manager"
                              value={editingProperty.manager}
                              onChange={(e) => setEditingProperty({ ...editingProperty, manager: e.target.value })}
                              className="border p-2 rounded"
                            />
                            <input
                              type="text"
                              placeholder="Type (e.g., For Sale)"
                              value={editingProperty.type}
                              onChange={(e) => setEditingProperty({ ...editingProperty, type: e.target.value })}
                              className="border p-2 rounded"
                            />
                            <input
                              type="number"
                              placeholder="Latitude"
                              value={editingProperty.latitude}
                              onChange={(e) => setEditingProperty({ ...editingProperty, latitude: Number(e.target.value) })}
                              className="border p-2 rounded"
                            />
                            <input
                              type="number"
                              placeholder="Longitude"
                              value={editingProperty.longitude}
                              onChange={(e) => setEditingProperty({ ...editingProperty, longitude: Number(e.target.value) })}
                              className="border p-2 rounded"
                            />
                            <input
                              type="text"
                              placeholder="Contact Number"
                              value={editingProperty.contact ?? ""}
                              onChange={(e) => setEditingProperty({ ...editingProperty, contact: e.target.value })}
                              className="border p-2 rounded"
                            />
                          </div>

                          <textarea
                            placeholder="Description"
                            value={editingProperty.description}
                            onChange={(e) =>
                              setEditingProperty({ ...editingProperty, description: e.target.value })
                            }
                            required
                            className="border p-2 rounded mt-4 w-full"
                          />

                          <div className="flex justify-end mt-6 space-x-2">
                            <button
                              type="button"
                              onClick={() => setIsEditModalOpen(false)}
                              className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                            >
                              Save Changes
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                    </div>
                  )}

                </div>
              )}

              {activeTab === "inquiries" && (
                <div className="p-6">
                  <div className="head-title">
                    <div className="left">
                      <h1>Inquiries</h1>
                      <ul className="breadcrumb">
                        <li>
                          <Link href="#">Inquiries</Link>
                        </li>
                        <li><i className='bx bx-chevron-right'></i></li>
                        <li>
                          <Link href="#" className="active">Pending Inquiries</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="table-data">
                    <div className="order">
                    <div className="head">
                      <h3>Pending Inquiries</h3>
                      <i className='bx bx-plus icon'></i>
                    </div>
                      <table>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Company</th>
                            <th>Contact Person</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Budget</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {inquiriesToDisplay.length > 0 ? (
                            inquiriesToDisplay.map((inquiry) => (
                              <tr key={inquiry.id}>
                                <td>{inquiry.id}</td>
                                <td>{inquiry.companyName}</td>
                                <td>{inquiry.contactPerson}</td>
                                <td>{inquiry.email}</td>
                                <td>{inquiry.phone}</td>
                                <td>{inquiry.budget ? `$${inquiry.budget.toLocaleString()}` : '—'}</td>
                                <td>{inquiry.status === 1 ? "Active" : "Pending"}</td>
                                <td>
                                  <button
                                    onClick={() => handleEdit(inquiry.id)}
                                    className="edit-btn"
                                    style={{ marginRight: '10px' }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDelete(inquiry.id)}
                                    className="delete-btn"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={8} className="py-4 text-center">No inquiries found</td>
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
                  <div className="head-title">
                    <div className="left">
                      <h1>Users</h1>
                      <ul className="breadcrumb">
                        <li>
                          <Link href="#">Users</Link>
                        </li>
                        <li><i className='bx bx-chevron-right'></i></li>
                        <li>
                          <Link href="#" className="active">Manage Users</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="table-data">
                    <div className="order">
                      <div className="head">
                        <h3>Manage Users</h3>
                        <i className='bx bx-plus icon'></i>
                      </div>
                      <table>
                        <thead>
                          <tr>
                            {/* <th className="py-2 px-4"></th> */}
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
                                {/* <Image src="https://placehold.co/600x400/png" width={40} height={40} alt="Profile"/> */}
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
      </div>
      <footer className="footer">
        <p>
            &copy; {new Date().getFullYear()} <a href="https://fusionlabz.lk" target="_blank" rel="noopener noreferrer">FusionLabz</a>. All Rights Reserved.
        </p>
      </footer>
      </>
    
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