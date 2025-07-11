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
  status: number;
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
    property.status === 1 && (
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.type.toLowerCase().includes(searchTerm.toLowerCase())
      // add other search criteria if needed
    )
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

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);


  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<number | null>(null);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);


  // Handle page change for both users and properties
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPagesForProperties) {
      setCurrentPage(page);
    }
  };

  // Handle Edit
  const handleEditProperties = (propertyId: number) => {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      setEditingProperty(property);
      setIsEditModalOpen(true);
    }
  };
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProperty, setNewProperty] = useState({
    title: "",
    description: "",
    price: null,
    category: "",
    images: [],
    latitude: null,
    longitude: null,
    district: "",
    type: "",
    manager: "",
    contact: "",
    status: 1,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  function showMessage(message: string) {
    setModalMessage(message);
    setIsMessageModalOpen(true);
    setIsFadingOut(false); // start fully visible
  
    // After 2.5 seconds, start fade-out
    setTimeout(() => {
      setIsFadingOut(true);
    }, 2500);
  
    // After 3 seconds total, close modal completely
    setTimeout(() => {
      setIsMessageModalOpen(false);
      setModalMessage(null);
      setIsFadingOut(false);
    }, 3000);
  }
  
  const handleDeleteProperties = async (propertyId: number) => {
    try {
      const propertyToUpdate = properties.find((p) => p.id === propertyId);
      if (!propertyToUpdate) {
        alert("Property not found.");
        return;
      }
  
      // Destructure to exclude 'images'
      const { images, ...propertyDataWithoutImages } = propertyToUpdate;
  
      // Update only the status
      const updatedProperty = {
        ...propertyDataWithoutImages,
        status: 0,
      };
  
      const res = await fetch("/api/properties", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProperty),
      });
  
      if (res.ok) {
        const updated = await res.json();
        setProperties((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
        );
        showMessage("Property successfully deleted.");
      } else {
        const err = await res.json();
        showMessage("Delete failed: " + err.message);
      }
    } catch (err) {
      console.error(err);
      showMessage("Something went wrong during delete.");
    }
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
                  id="search"
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
                      <i className="bx bx-plus icon cursor-pointer" onClick={() => setIsAddModalOpen(true)}></i>
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
                            <th>Images</th>
                            <th>Actions</th> 
                          </tr>
                        </thead>
                        <tbody>
                          {propertiesToDisplay.length > 0 ? (
                            propertiesToDisplay.map((property) => (
                              <tr key={property.id}>
                                <td style={{ padding: "16px" }}>
                                  <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: "100%",
                                    minHeight: "50px", // Adjust if needed
                                    textAlign: "center",
                                  }}>
                                    {property.id}
                                  </div>
                                </td>
                                <td style={{
                                    whiteSpace: "normal",     // Allow text to wrap
                                    wordBreak: "break-word",  // Break long words
                                    maxWidth: "200px",        // Optional: limit width to control wrap
                                    padding: "12px 16px"
                                  }}>{property.title}</td>
                                <td style={{
                                    whiteSpace: "normal",
                                    wordBreak: "break-word",
                                    maxWidth: "300px",
                                    padding: "12px 16px"
                                  }}>{property.description}</td>
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
                                <td style={{ padding: "16px" }}>
                                  <div style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      height: "100%",
                                      minHeight: "50px", // Adjust if needed
                                      textAlign: "center",
                                    }}>
                                    <button
                                      className="view-btn"
                                      onClick={() => {
                                        const images = (() => {
                                          try {
                                            const parsed = JSON.parse(property.images);
                                            return Array.isArray(parsed) ? parsed : [];
                                          } catch {
                                            return [];
                                          }
                                        })();
                                      
                                        setSelectedPropertyId(property.id); // Set this for upload logic
                                        setSelectedImages(images);
                                        setCurrentImageIndex(0); // Reset index on open
                                        setIsImageModalOpen(true);
                                      }}                                      
                                    >
                                      View
                                    </button>

                                  </div>
                                </td>

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
                                    onClick={() => {
                                      setPropertyToDelete(property.id);
                                      setIsDeleteModalOpen(true);
                                    }}
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

                      {isImageModalOpen && (
                        <div className="modal-container" onClick={() => setIsImageModalOpen(false)}>
                          <div className="modal-content-image" onClick={(e) => e.stopPropagation()}>
                            <h2 className="text-xl font-semibold mb-4">Property Images</h2>

                            <button
                              onClick={() => setIsImageModalOpen(false)}
                              className="modal-close-btn"
                              aria-label="Close"
                            >
                              &times;
                            </button>

                            {selectedImages.length > 0 ? (
                              <div className="text-center">
                                <img
                                  src={selectedImages[currentImageIndex]}
                                  alt={`Property image ${currentImageIndex + 1}`}
                                  className="w-96 h-60 object-cover rounded border mx-auto"
                                />

                                <div className="flex justify-center mt-4 space-x-2">
                                  <button
                                    disabled={currentImageIndex === 0}
                                    onClick={() => setCurrentImageIndex((prev) => prev - 1)}
                                    className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                                  >
                                    Previous
                                  </button>
                                  <button
                                    disabled={currentImageIndex === selectedImages.length - 1}
                                    onClick={() => setCurrentImageIndex((prev) => prev + 1)}
                                    className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                                  >
                                    Next
                                  </button>
                                  <button
                                    onClick={() => {
                                      const updatedImages = [...selectedImages];
                                      updatedImages.splice(currentImageIndex, 1);
                                    
                                      setSelectedImages(updatedImages);
                                      setCurrentImageIndex((prev) =>
                                        prev >= updatedImages.length ? updatedImages.length - 1 : prev
                                      );
                                    
                                      // Immediately update DB
                                      fetch("/api/properties", {
                                        method: "PUT",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                          ...properties.find((p) => p.id === selectedPropertyId),
                                          images: updatedImages,
                                        }),
                                      });
                                    }}                                    
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-center">No images available</p>
                            )}

                            {/* Add New Image Section */}
                            <div className="mt-6 text-center space-y-2">
                              <p className="text-sm text-gray-700">Add Image from Computer</p>

                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setSelectedFile(file);
                                  }
                                }}
                                className="border border-gray-300 rounded px-4 py-2"
                              />

                              <button
                                className="bg-blue-600 text-white px-4 py-2 rounded mt-2 hover:bg-blue-700 disabled:opacity-50"
                                disabled={isUploading}
                                onClick={async () => {
                                  if (!selectedFile || !selectedPropertyId) {
                                    alert("Please choose a file.");
                                    return;
                                  }

                                  setIsUploading(true);

                                  try {
                                    const formData = new FormData();
                                    formData.append("file", selectedFile);
                                    formData.append("propertyId", selectedPropertyId.toString());

                                    const res = await fetch("/api/upload-image", {
                                      method: "POST",
                                      body: formData,
                                    });
                                    
                                    if (!res.ok) {
                                      const error = await res.json();
                                      alert("Upload failed: " + error.message);
                                      return;
                                    }
                                    
                                    const { newImagePath } = await res.json(); 
                                    
                                    if (newImagePath) {
                                      // Now update DB
                                      const updatedProperty = {
                                        ...properties.find(p => p.id === selectedPropertyId),
                                        images: [...selectedImages, newImagePath]
                                      };
                                    
                                      await fetch("/api/properties", {
                                        method: "PUT",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify(updatedProperty),
                                      });
                                    
                                      setSelectedImages((prev) => [...prev, newImagePath]);
                                      alert("Image uploaded successfully!");
                                    }                                    
                                  } catch (err) {
                                    console.error("Upload error:", err);
                                    alert("Something went wrong.");
                                  } finally {
                                    setIsUploading(false);
                                  }
                                }}
                              >
                                {isUploading ? "Uploading..." : "Add Image"}
                              </button>

                              <div className="mt-2 text-sm text-gray-500">Supported formats: JPG, PNG, WebP</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {isAddModalOpen && (
                        <div className="modal-container" onClick={() => setIsAddModalOpen(false)}>
                          <div className="modal-content-add" onClick={(e) => e.stopPropagation()}>
                            <h2 className="text-xl font-semibold mb-4" style={{ marginBottom: "3%" }}>Add New Property</h2>

                            <button
                              className="modal-close-btn"
                              onClick={() => setIsAddModalOpen(false)}
                              aria-label="Close"
                            >
                              &times;
                            </button>

                            {/* Form Fields */}
                            <div className="grid grid-cols-2 gap-4">
                              <div className="form-row-add">
                                <input type="text" placeholder="Title" value={newProperty.title}
                                  onChange={(e) => setNewProperty({ ...newProperty, title: e.target.value })} className="border p-2 rounded" />
                                </div>
                                <div className="form-row-add">
                                <select 
                                  id="category" 
                                  value={newProperty.category}
                                  onChange={(e) => setNewProperty({ ...newProperty, category: e.target.value })} className="border p-2 rounded" 
                                  required
                                >
                                  <option value="" disabled>
                                  Select Category
                                  </option>
                                  <option value="Corporate ">Corporate </option>
                                  <option value="Retail">Retail</option>
                                  <option value="Residential">Residential</option>
                                </select>
                                </div>
                                <div className="form-row-add">
                                <input type="number" placeholder="Price" value={newProperty.price ?? ""}
                                  onChange={(e) => setNewProperty({ ...newProperty, price: Number(e.target.value) })} className="border p-2 rounded" />
                                </div>
                                <div className="form-row-add">
                                <input type="text" placeholder="Manager" value={newProperty.manager}
                                  onChange={(e) => setNewProperty({ ...newProperty, manager: e.target.value })} className="border p-2 rounded" />
                                </div>
                                <div className="form-row-add">
                                <input type="text" placeholder="Contact" value={newProperty.contact}
                                  onChange={(e) => setNewProperty({ ...newProperty, contact: e.target.value })} className="border p-2 rounded" />
                                </div>
                                <div className="form-row-add">
                                  <select 
                                    id="district"
                                    value={newProperty.district}
                                    onChange={(e) => setNewProperty({ ...newProperty, district: e.target.value })} className="border p-2 rounded" 
                                    >
                                    <option value="" disabled>
                                    Select District
                                    </option>
                                    <option value="Ampara">Ampara</option>
                                    <option value="Anuradhapura">Anuradhapura</option>
                                    <option value="Badulla">Badulla</option>
                                    <option value="Batticaloa">Batticaloa</option>
                                    <option value="Colombo">Colombo</option>
                                    <option value="Galle">Galle</option>
                                    <option value="Gampaha">Gampaha</option>
                                    <option value="Hambantota">Hambantota</option>
                                    <option value="Jaffna">Jaffna</option>
                                    <option value="Kalutara">Kalutara</option>
                                    <option value="Kandy">Kandy</option>
                                    <option value="Kegalle">Kegalle</option>
                                    <option value="Kilinochchi">Kilinochchi</option>
                                    <option value="Kurunegala">Kurunegala</option>
                                    <option value="Mannar">Mannar</option>
                                    <option value="Matale">Matale</option>
                                    <option value="Matara">Matara</option>
                                    <option value="Moneragala">Moneragala</option>
                                    <option value="Mullaitivu">Mullaitivu</option>
                                    <option value="Nuwara Eliya">Nuwara Eliya</option>
                                    <option value="Polonnaruwa">Polonnaruwa</option>
                                    <option value="Puttalam">Puttalam</option>
                                    <option value="Ratnapura">Ratnapura</option>
                                    <option value="Trincomalee">Trincomalee</option>
                                    <option value="Vavuniya">Vavuniya</option>
                                  </select>
                                </div>
                                <div className="form-row-add">
                                <select 
                                  id="type" 
                                  value={newProperty.type}
                                  onChange={(e) => setNewProperty({ ...newProperty, type: e.target.value })} className="border p-2 rounded" 
                                  >
                                  <option value="" disabled>
                                  Select Type
                                  </option>
                                  <option value="For Sale">For Sale</option>
                                  <option value="For Rent">For Rent</option>
                                  <option value="Wanted">Wanted</option>
                                </select>
                                </div>
                                <div className="form-row-add">
                                <input type="number" placeholder="Latitude" value={newProperty.latitude ?? ""}
                                  onChange={(e) => setNewProperty({ ...newProperty, latitude: Number(e.target.value) })} className="border p-2 rounded" />
                                </div>
                                <div className="form-row-add">
                                <input type="number" placeholder="Longitude" value={newProperty.longitude ?? ""}
                                  onChange={(e) => setNewProperty({ ...newProperty, longitude: Number(e.target.value) })} className="border p-2 rounded" />
                              </div>
                            </div>

                            <textarea placeholder="Description"
                              value={newProperty.description}
                              onChange={(e) => setNewProperty({ ...newProperty, description: e.target.value })}
                              className="border p-2 rounded mt-4 w-full"
                            />

                            <div className="mt-4">
                              <label className="block mb-1 font-semibold">Upload Image</label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setImageFile(file);
                                  }
                                }}
                                className="border border-gray-300 rounded px-4 py-2"
                              />
                            </div>

                            <div className="button-container">
                              <button
                                onClick={async () => {
                                  try {
                                    let uploadedImagePath = "";
                                
                                    // 1. If image is selected, upload it first
                                    if (imageFile) {
                                      const formData = new FormData();
                                      formData.append("file", imageFile);
                                      formData.append("propertyId", "new"); // optional, for future use
                                
                                      const uploadRes = await fetch("/api/upload-image", {
                                        method: "POST",
                                        body: formData,
                                      });
                                
                                      if (!uploadRes.ok) {
                                        throw new Error("Image upload failed");
                                      }
                                
                                      const uploadData = await uploadRes.json();
                                      uploadedImagePath = uploadData.newImagePath;
                                    }
                                
                                    // 2. Now submit the property creation
                                    const res = await fetch("/api/properties", {
                                      method: "POST",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({
                                        ...newProperty,
                                        images: uploadedImagePath ? [uploadedImagePath] : [],
                                      }),
                                    });
                                
                                    if (res.ok) {
                                      const created = await res.json();
                                      setProperties((prev) => [...prev, created]);
                                      setIsAddModalOpen(false);
                                
                                      // Reset form
                                      setNewProperty({
                                        title: "",
                                        description: "",
                                        price: null,
                                        category: "",
                                        latitude: null,
                                        longitude: null,
                                        district: "",
                                        type: "",
                                        manager: "",
                                        contact: "",
                                        status: 1,
                                        images: [],
                                      });
                                      setImageFile(null);
                                    } else {
                                      const err = await res.json();
                                      alert("Failed to create property: " + err.message);
                                    }
                                  } catch (err) {
                                    console.error(err);
                                    alert("Something went wrong while adding the property.");
                                  }
                                }}                                
                                className="button-save"
                              >
                                Add Property
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {isDeleteModalOpen && (
                        <div className="modal-overlay">
                          <div className="modal-content-delete">
                            <h3>Confirm Delete</h3>
                            <p>Are you sure you want to delete this property?</p>
                            <div className="modal-buttons">
                              <button
                                className="button-cancel"
                                onClick={() => setIsDeleteModalOpen(false)}
                              >
                                Cancel
                              </button>
                              <button
                                className="button-delete"
                                onClick={() => {
                                  if (propertyToDelete !== null) {
                                    handleDeleteProperties(propertyToDelete);
                                  }
                                  setIsDeleteModalOpen(false);
                                }}
                              >
                                Yes, Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {isMessageModalOpen && (
                        <div
                          className={`message-modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-500
                            ${isFadingOut ? "opacity-0" : "opacity-100"}`}
                          style={{ zIndex: 9999 }}
                        >
                          <div className="bg-white p-6 rounded shadow-lg max-w-sm text-center">
                            {modalMessage}
                          </div>
                        </div>
                      )}


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
                    <div className="modal-container">
                      <div className="modal-content">
                      <h2 className="text-2xl font-semibold mb-4" style={{ marginBottom: "3%" }}>
                        Edit Property
                      </h2>
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();

                          try {
                            // Create a copy of editingProperty without 'images' field
                            const { images, ...propertyDataWithoutImages } = editingProperty;

                            // Now send propertyDataWithoutImages instead of editingProperty
                            const res = await fetch("/api/properties", {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify(propertyDataWithoutImages),
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
                            <div className="form-row">
                              <label htmlFor="title" style={{ fontWeight: "600" }}>
                                Title
                              </label>
                              <input
                                id="title"
                                type="text"
                                placeholder="Title"
                                value={editingProperty.title}
                                onChange={(e) => setEditingProperty({ ...editingProperty, title: e.target.value })}
                                required
                                style={{ padding: "0.5rem", borderRadius: "0.25rem", border: "1px solid #ccc" }}
                              />
                            </div>
                            <div className="form-row">
                              <label htmlFor="category" style={{ fontWeight: "600" }}>
                                Category
                              </label>
                              <select
                                id="category"
                                value={editingProperty.category}
                                onChange={(e) => setEditingProperty({ ...editingProperty, category: e.target.value })}
                                required
                                className="border p-2 rounded"
                              >
                                <option value="Corporate ">Corporate </option>
                                <option value="Retail">Retail</option>
                                <option value="Residential">Residential</option>
                              </select>
                            </div>
                            <div className="form-row">
                              <label htmlFor="price" style={{ fontWeight: "600" }}>
                                Price (Rs.)
                              </label>
                              <input
                                id="price"
                                type="number"
                                placeholder="Price"
                                value={editingProperty.price ?? ""}
                                onChange={(e) => setEditingProperty({ ...editingProperty, price: Number(e.target.value) })}
                                className="border p-2 rounded"
                              />
                            </div>
                            <div className="form-row">
                              <label htmlFor="district" style={{ fontWeight: "600" }}>
                                District
                              </label>
                              <select
                                id="district"
                                value={editingProperty.district}
                                onChange={(e) => setEditingProperty({ ...editingProperty, district: e.target.value })}
                                className="border border-gray-300 p-2 rounded focus:border-blue-600 focus:ring-2 focus:ring-blue-400"
                              >
                                <option value="Ampara">Ampara</option>
                                <option value="Anuradhapura">Anuradhapura</option>
                                <option value="Badulla">Badulla</option>
                                <option value="Batticaloa">Batticaloa</option>
                                <option value="Colombo">Colombo</option>
                                <option value="Galle">Galle</option>
                                <option value="Gampaha">Gampaha</option>
                                <option value="Hambantota">Hambantota</option>
                                <option value="Jaffna">Jaffna</option>
                                <option value="Kalutara">Kalutara</option>
                                <option value="Kandy">Kandy</option>
                                <option value="Kegalle">Kegalle</option>
                                <option value="Kilinochchi">Kilinochchi</option>
                                <option value="Kurunegala">Kurunegala</option>
                                <option value="Mannar">Mannar</option>
                                <option value="Matale">Matale</option>
                                <option value="Matara">Matara</option>
                                <option value="Moneragala">Moneragala</option>
                                <option value="Mullaitivu">Mullaitivu</option>
                                <option value="Nuwara Eliya">Nuwara Eliya</option>
                                <option value="Polonnaruwa">Polonnaruwa</option>
                                <option value="Puttalam">Puttalam</option>
                                <option value="Ratnapura">Ratnapura</option>
                                <option value="Trincomalee">Trincomalee</option>
                                <option value="Vavuniya">Vavuniya</option>
                              </select>
                            </div>
                            <div className="form-row">
                              <label htmlFor="manager" style={{ fontWeight: "600" }}>
                                Manager
                              </label>
                              <input
                                id="manager"
                                type="text"
                                placeholder="Manager"
                                value={editingProperty.manager}
                                onChange={(e) => setEditingProperty({ ...editingProperty, manager: e.target.value })}
                                className="border p-2 rounded"
                              />
                            </div>
                            <div className="form-row">
                              <label htmlFor="type" style={{ fontWeight: "600" }}>
                                Type
                              </label>
                              <select
                                id="type"
                                value={editingProperty.type}
                                onChange={(e) => setEditingProperty({ ...editingProperty, type: e.target.value })}
                                className="border p-2 rounded"
                              >
                                {/* <option value="" disabled>
                                  Select Type (e.g., For Sale)
                                </option> */}
                                <option value="For Sale">For Sale</option>
                                <option value="For Rent">For Rent</option>
                                <option value="Wanted">Wanted</option>
                              </select>
                            </div>
                            <div className="form-row">
                              <label htmlFor="latitude" style={{ fontWeight: "600" }}>
                                Latitude
                              </label>
                              <input
                                id="latitude"
                                type="number"
                                placeholder="Latitude"
                                value={editingProperty.latitude}
                                onChange={(e) => setEditingProperty({ ...editingProperty, latitude: Number(e.target.value) })}
                                className="border p-2 rounded"
                              />
                            </div>
                            <div className="form-row">
                              <label htmlFor="longitude" style={{ fontWeight: "600" }}>
                                Longitude
                              </label>
                              <input
                                id="longitude"
                                type="number"
                                placeholder="Longitude"
                                value={editingProperty.longitude}
                                onChange={(e) => setEditingProperty({ ...editingProperty, longitude: Number(e.target.value) })}
                                className="border p-2 rounded"
                              />
                            </div>
                            <div className="form-row">
                              <label htmlFor="contact" style={{ fontWeight: "600" }}>
                                Contact Number
                              </label>
                              <input
                                id="contact"
                                type="text"
                                placeholder="Contact Number"
                                value={editingProperty.contact ?? ""}
                                onChange={(e) => setEditingProperty({ ...editingProperty, contact: e.target.value })}
                                className="border p-2 rounded"
                              />
                            </div>
                          </div>
                          <div className="form-row">
                            <label htmlFor="description" style={{ fontWeight: "600" }}>
                            Description
                            </label>
                            <textarea
                              id="description"
                              placeholder="Description"
                              value={editingProperty.description}
                              onChange={(e) =>
                                setEditingProperty({ ...editingProperty, description: e.target.value })
                              }
                              required
                              className="border p-2 rounded mt-4 w-full"
                            />
                          </div>

                          <div className="button-container">
                            <button
                              type="button"
                              onClick={() => setIsEditModalOpen(false)}
                              className="button-cancel"
                            >
                              Cancel
                            </button>
                            <button type="submit" className="button-save">
                              Save Changes
                            </button>
                          </div>
                        </form>
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
                                    // onClick={() => handleEdit(inquiry.id)}
                                    className="edit-btn"
                                    style={{ marginRight: '10px' }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    // onClick={() => handleDelete(inquiry.id)}
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
                                    // onClick={() => handleEdit(user.id)}
                                    className="edit-btn"
                                    style={{ marginRight: '10px' }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    // onClick={() => handleDelete(user.id)}
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