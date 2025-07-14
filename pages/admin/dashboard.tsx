import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import Link from 'next/link';
import Image from 'next/image';
import 'boxicons/css/boxicons.min.css';
import '../../components/dashboard.css';
import SidebarScript from "../../components/SidebarScript"; 
import Logo from "../../src/img/Propwise Logo No BG.png";
import { useDashboardData } from "../../hooks/userDashboardData";
import PropertyTable from "../../components/admin/PropertyTable";
import ImageModal from "../../components/admin/ImageModal";
import AddPropertyForm from "../../components/admin/AddPropertyForm";
import EditPropertyModal from "../../components/admin/EditPropertyModal";
import InquiryTable from "../../components/admin/InquiryTable";
import { useMessage } from "../../components/MessageBox";

export default function PropertyDashboard() { 
  
  const {
    activeTab,
    setActiveTab,
    darkMode,
    toggleDarkMode,
    searchTerm,
    setSearchTerm,
    properties,
    setProperties,
    inquiries,
    setInquiries,
    users,
    setUsers,
    activeListings,
    activeInquiries,
    notes,
    newNote,
    setNewNote,
    addNote,
    toggleNote,
    deleteNote,
    handleLogout,
    currentPageForUsers,
    setCurrentPageForUsers,
    currentPageForProperties,
    setCurrentPageForProperties,
    currentPageForInquiries,
    setCurrentPageForInquiries,
    fetchProperties,
    fetchInquiries,
    fetchUsers,
    usersToDisplay,
    propertiesToDisplay,
    inquiriesToDisplay,
    totalPagesForProperties,
    totalPagesForInquiries,
    totalPagesForUsers,
    isImageModalOpen,
    setIsImageModalOpen,
    selectedImages,
    setSelectedImages,
    modalMessage,
    isMessageModalOpen,
    isFadingOut,
    isEditModalOpen,
    setIsEditModalOpen,
    editingProperty,
    setEditingProperty,
    editingInquiry,
    setEditingInquiry,
    editingUser,
    setEditingUser,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    propertyToDelete,
    setPropertyToDelete,
    inquiryToDelete,
    setInquiryToDelete,
    userToDelete,
    setUserToDelete,
    currentImageIndex,
    setCurrentImageIndex,
    selectedFile,
    setSelectedFile,
    selectedPropertyId,
    setSelectedPropertyId,
    isUploading,
    setIsUploading,
    isAddModalOpen,
    setIsAddModalOpen,
    isAddInqModalOpen,
    setIsAddInqModalOpen,
    isAddUserModalOpen,
    setIsAddUserModalOpen,
    newProperty,
    setNewProperty,
    newInquiry,
    setNewInquiry,
    newUser,
    setNewUser,
    imageFile,
    setImageFile,
    handleDeleteProperties,
    handleDeleteInquiry,
    handleDeleteUser,
  } = useDashboardData();

  // Handle page change for properties
  function handlePageChangeForProperties(page: number) {
    if (page < 1 || page > totalPagesForProperties) 
      return;
    setCurrentPageForProperties(page);
  }

  function handlePageChangeForInquiries(page: number) {
    if (page < 1 || page > totalPagesForInquiries) 
      return;
    setCurrentPageForInquiries(page);
  }

  function handlePageChangeForUsers(page: number) {
    if (page < 1 || page > totalPagesForUsers) 
      return;
    setCurrentPageForUsers(page);
  }
  
  const { showMessage } = useMessage();

  return (  
    <>
      <SidebarScript /><div className={darkMode ? 'dark' : ''}>
        <section id="sidebar" className="sidebar">
          <Link href="#" className="brand">
            <Image src={Logo} width={60} height={60} alt="Logo" className="logo-image" />
            <span className="text" style={{ color: "gray", paddingLeft: "5%"}}>Propwise</span>
          </Link>
          <ul className="side-menu top">
            <li className={activeTab === "dashboard" ? "active" : ""}>
              <Link href="#" onClick={() => setActiveTab("dashboard")} className="nav-link">
                <i className="bx bxs-dashboard bx-sm"></i>
                <span className="text">Dashboard</span>
              </Link>
            </li>

            <li className={activeTab === "properties" ? "active" : ""}>
              <Link href="#" onClick={() => setActiveTab("properties")} className="nav-link">
                <i className="bx bxs-building-house bx-sm"></i>
                <span className="text">Active Properties</span>
              </Link>
            </li>

            <li className={activeTab === "inquiries" ? "active" : ""}>
              <Link href="#" onClick={() => setActiveTab("inquiries")} className="nav-link">
                <i className="bx bxs-envelope bx-sm"></i>
                <span className="text">Pending Inquiries</span>
              </Link>
            </li>

            <li className={activeTab === "users" ? "active" : ""}>
              <Link href="#" onClick={() => { setActiveTab("users"); fetchUsers(); }} className="nav-link">
                <i className="bx bxs-user bx-sm"></i>
                <span className="text">Users</span>
              </Link>
            </li>
          </ul>
          <ul className="side-menu bottom">
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
              </div>
            </form>
            <input type="checkbox" className="checkbox" id="switch-mode" hidden />
            <label className="swith-lm" htmlFor="switch-mode" onClick={toggleDarkMode}>
              <i className="bx bx-sun"></i>
              <i className="bx bxs-moon"></i>
              <div className="ball"></div>
            </label>

            {/* Notification Bell */}
            <a href="#" className="notification" id="notificationIcon">
              <i className='bx bxs-bell bx-tada-hover'></i>
              <span className="num">{notes.length}</span>
            </a>
            <div className="notification-menu" id="notificationMenu">
              <ul>
                {notes.length > 0 ? (
                  notes.map((note, index) => (
                    <li key={index}>
                      {note.text}
                      <i
                        className="bx bx-trash hover:text-red-500 ml-2 cursor-pointer"
                        onClick={() => deleteNote(index)}
                      ></i>
                    </li>
                  ))
                ) : (
                  <li>No new notes</li>
                )}
              </ul>
            </div>

            {/* Profile Menu */}
            {/* <Link href="#" className="profile">
              <Image src="https://placehold.co/600x400/png" width={40} height={40} alt="Profile" />
            </Link>
            <div className="profile-menu" id="profileMenu">
                <ul> */}
                    {/* <li><a href="#">My Profile</a></li> */}
                    {/* <li><a href="#">Settings</a></li> */}
                    {/* <li><a href="/login" onClick={handleLogout}>Log Out</a></li>
                </ul>
            </div> */}
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
                  <li style={{marginRight:"1rem"}}>
                    <i className='bx bxs-calendar-check'></i>
                    <span className="text">
                      <h3>Active Listings</h3>
                      <p>{activeListings}</p>
                    </span>
                  </li>
                  <li style={{marginRight:"1rem"}}>
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
                      <h3>Notes</h3>
                    </div>
                    <div className="note-input-wrapper">
                      <input
                        type="text"
                        placeholder="Add note..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                      />
                      <button onClick={addNote}>+</button>
                    </div>

                    <ul className="todo-list mt-4">
                      {notes.map((note, idx) => (
                        <li
                          key={idx}
                          className={note.completed ? "completed" : "not-completed"}
                          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                        >
                          <p
                            onClick={() => toggleNote(idx)}
                            style={{ cursor: "pointer", textDecoration: note.completed ? "line-through" : "none" }}
                          >
                            {note.text}
                          </p>
                          <i
                            className="bx bx-x text-red-500 cursor-pointer"
                            onClick={() => deleteNote(idx)}
                          ></i>
                        </li>
                      ))}
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
                        <PropertyTable
                          properties={propertiesToDisplay}
                          setEditingProperty={setEditingProperty}
                          setIsEditModalOpen={setIsEditModalOpen}
                          setPropertyToDelete={setPropertyToDelete}
                          setIsDeleteModalOpen={setIsDeleteModalOpen}
                          setSelectedPropertyId={setSelectedPropertyId}
                          setSelectedImages={setSelectedImages}
                          setCurrentImageIndex={setCurrentImageIndex}
                          setIsImageModalOpen={setIsImageModalOpen}
                        />
                      </table>

                      <ImageModal
                        isOpen={isImageModalOpen}
                        onClose={() => setIsImageModalOpen(false)}
                        selectedImages={selectedImages}
                        currentImageIndex={currentImageIndex}
                        setCurrentImageIndex={setCurrentImageIndex}
                        selectedPropertyId={selectedPropertyId}
                        setSelectedImages={setSelectedImages}
                        properties={properties}
                        selectedFile={selectedFile}
                        setSelectedFile={setSelectedFile}
                        isUploading={isUploading}
                        setIsUploading={setIsUploading}
                      />

                      <AddPropertyForm
                        isOpen={isAddModalOpen}
                        onClose={() => setIsAddModalOpen(false)}
                        newProperty={newProperty}
                        setNewProperty={setNewProperty}
                        imageFile={imageFile}
                        setImageFile={setImageFile}
                        setProperties={setProperties}
                        fetchProperties={fetchProperties}
                      />

                      <EditPropertyModal
                        isOpen={isEditModalOpen}
                        editingProperty={editingProperty}
                        setEditingProperty={setEditingProperty}
                        setIsEditModalOpen={setIsEditModalOpen}
                        setProperties={setProperties}
                      />
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
                          onClick={() => handlePageChangeForProperties(currentPageForProperties - 1)}
                          disabled={currentPageForProperties === 1}
                          className="pagination-btn"
                        >
                          « Previous
                        </button>

                        <span>Page {currentPageForProperties} of {totalPagesForProperties}</span>

                        <button
                          onClick={() => handlePageChangeForProperties(currentPageForProperties + 1)}
                          disabled={currentPageForProperties === totalPagesForProperties}
                          className="pagination-btn"
                        >
                          Next »
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
{/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */}
              {/* Inquiries */}
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
                      <i className="bx bx-plus icon cursor-pointer" onClick={() => setIsAddInqModalOpen(true)}></i>
                    </div>
                      <table>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Company</th>
                            <th>Contact Person</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Requirements</th>
                            <th>Budget</th>
                            <th>Attachments</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <InquiryTable
                          inquiriesToDisplay={inquiriesToDisplay}
                          setEditingInquiry={setEditingInquiry}
                          setIsEditModalOpen={setIsEditModalOpen}
                          setInquiryToDelete={setInquiryToDelete}
                          setIsDeleteModalOpen={setIsDeleteModalOpen}
                          setSelectedPropertyId={setSelectedPropertyId}
                          setSelectedImages={setSelectedImages}
                          setCurrentImageIndex={setCurrentImageIndex}
                          setIsImageModalOpen={setIsImageModalOpen}
                        />
                      </table>

                      {isDeleteModalOpen && (
                        <div className="modal-overlay">
                          <div className="modal-content-delete">
                            <h3>Confirm Delete</h3>
                            <p>Are you sure you want to delete this inquiry?</p>
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
                                  if (inquiryToDelete !== null) {
                                    handleDeleteInquiry(inquiryToDelete); // Make sure this function is defined
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

                      {isImageModalOpen && (
                        <div className="modal-container" onClick={() => setIsImageModalOpen(false)}>
                          <div className="modal-content-image" onClick={(e) => e.stopPropagation()}>
                            <h2 className="text-xl font-semibold mb-4">Inquiry Attachments</h2>

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
                                  alt={`Attachment ${currentImageIndex + 1}`}
                                  className="w-96 h-60 object-cover rounded border mx-auto"
                                />

                                <div className="pagination-controls">
                                  <button
                                    disabled={currentImageIndex === 0}
                                    onClick={() => setCurrentImageIndex((prev) => prev - 1)}
                                    className="pagination-btn"
                                  >
                                    Previous
                                  </button>
                                  <button
                                    disabled={currentImageIndex === selectedImages.length - 1}
                                    onClick={() => setCurrentImageIndex((prev) => prev + 1)}
                                    className="pagination-btn"
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

                                      // Update DB
                                      fetch("/api/inquiries", {
                                        method: "PUT",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                          ...inquiries.find((i) => i.id === selectedPropertyId),
                                          attachments: updatedImages,
                                        }),
                                      });

                                      setInquiries((prev) =>
                                        prev.map((inq) =>
                                          inq.id === selectedPropertyId
                                            ? { ...inq, attachments: updatedImages }
                                            : inq
                                        )
                                      );
                                    }}
                                    className="delete-btn"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-center">No attachments available</p>
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

                              <div className="mt-2 text-sm text-gray-500">Supported formats: JPG, PNG, WebP</div>
                              
                              <button
                                className="button-save"
                                style={{ marginTop: "10px" }}
                                disabled={!selectedFile || isUploading}  // disable if no file selected or uploading
                                onClick={async () => {
                                  if (!selectedFile || !selectedPropertyId) {
                                    showMessage("Please choose a file.");
                                    return;
                                  }

                                  setIsUploading(true);

                                  try {
                                    const formData = new FormData();
                                    formData.append("file", selectedFile);
                                    formData.append("inquiryId", selectedPropertyId.toString());

                                    const res = await fetch("/api/upload-image", {
                                      method: "POST",
                                      body: formData,
                                    });

                                    if (!res.ok) {
                                      const error = await res.json();
                                      showMessage("Upload failed: " + error.message);
                                      return;
                                    }

                                    const { newImagePath } = await res.json();

                                    if (newImagePath) {
                                      const updatedImages = [...selectedImages, newImagePath];

                                      const existingInquiry = inquiries.find(
                                        (inq) => inq.id === selectedPropertyId
                                      );
                                      if (!existingInquiry) {
                                        showMessage("Inquiry not found.");
                                        return;
                                      }

                                      const updatedInquiry = {
                                        ...existingInquiry,
                                        attachments: updatedImages,
                                      };

                                      await fetch("/api/inquiries", {
                                        method: "PUT",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify(updatedInquiry),
                                      });

                                      setSelectedImages(updatedImages);

                                      setInquiries((prev) =>
                                        prev.map((inq) =>
                                          inq.id === selectedPropertyId
                                            ? { ...inq, attachments: updatedImages }
                                            : inq
                                        )
                                      );

                                      showMessage("Image uploaded successfully!");
                                      setSelectedFile(null);  // reset file selection after upload
                                    }
                                  } catch (err) {
                                    console.error("Upload error:", err);
                                    showMessage("Something went wrong.");
                                  } finally {
                                    setIsUploading(false);
                                  }
                                }}
                              >
                                {isUploading ? "Uploading..." : "Add Image"}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {isAddInqModalOpen && (
                        <div className="modal-container" onClick={() => setIsAddInqModalOpen(false)}>
                          <div className="modal-content-add" onClick={(e) => e.stopPropagation()}>
                            <h2 className="text-xl font-semibold mb-4" style={{ marginBottom: "3%" }}>Add New Inquiry</h2>

                            <button
                              className="modal-close-btn"
                              onClick={() => setIsAddInqModalOpen(false)}
                              aria-label="Close"
                            >
                              &times;
                            </button>

                            {/* Form Fields */}
                            <div className="grid grid-cols-2 gap-4">
                              <div className="form-row-add">
                                <input
                                  type="text"
                                  placeholder="Company Name"
                                  value={newInquiry.companyName}
                                  onChange={(e) => setNewInquiry({ ...newInquiry, companyName: e.target.value })}
                                  className="border p-2 rounded"
                                />
                              </div>
                              <div className="form-row-add">
                                <input
                                  type="text"
                                  placeholder="Contact Person"
                                  value={newInquiry.contactPerson}
                                  onChange={(e) => setNewInquiry({ ...newInquiry, contactPerson: e.target.value })}
                                  className="border p-2 rounded"
                                />
                              </div>
                              <div className="form-row-add">
                                <input
                                  type="email"
                                  placeholder="Email"
                                  value={newInquiry.email}
                                  onChange={(e) => setNewInquiry({ ...newInquiry, email: e.target.value })}
                                  className="border p-2 rounded"
                                />
                              </div>
                              <div className="form-row-add">
                                <input
                                  type="text"
                                  placeholder="Phone"
                                  value={newInquiry.phone}
                                  onChange={(e) => setNewInquiry({ ...newInquiry, phone: e.target.value })}
                                  className="border p-2 rounded"
                                />
                              </div>
                              <div className="form-row-add">
                                <input
                                  type="number"
                                  placeholder="Budget"
                                  value={newInquiry.budget ?? ""}
                                  onChange={(e) => setNewInquiry({ ...newInquiry, budget: Number(e.target.value) })}
                                  className="border p-2 rounded"
                                />
                              </div>
                            </div>

                            <textarea
                              placeholder="Requirements"
                              value={newInquiry.requirements ?? ""}
                              onChange={(e) => setNewInquiry({ ...newInquiry, requirements: e.target.value })}
                              className="border p-2 rounded mt-4 w-full"
                            />

                            <div className="mt-4" style={{ marginTop: "10px" }}>
                              <label className="block mb-1 font-semibold">Upload Image (optional)</label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) setImageFile(file);
                                }}
                                className="border border-gray-300 rounded px-4 py-2" style={{marginTop:"10px", color: "var(--dark)"}}
                              />
                            </div>

                            <div className="button-container">
                              <button
                                onClick={async () => {
                                  try {
                                    let uploadedImagePath = "";

                                    if (imageFile) {
                                      const formData = new FormData();
                                      formData.append("file", imageFile);
                                      formData.append("inquiryId", "new");

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

                                    const res = await fetch("/api/inquiries", {
                                      method: "POST",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({
                                        ...newInquiry,
                                        attachments: uploadedImagePath ? [uploadedImagePath] : [],
                                      }),
                                    });

                                    if (res.ok) {
                                      const created = await res.json();
                                      setInquiries((prev) => [...prev, created]);
                                      setIsAddInqModalOpen(false);

                                      await fetchInquiries();

                                      // Reset form
                                      setNewInquiry({
                                        companyName: "",
                                        contactPerson: "",
                                        email: "",
                                        phone: "",
                                        requirements: "",
                                        budget: null,
                                        attachments: [],
                                        status: 1,
                                      });
                                      setImageFile(null);
                                    } else {
                                      const err = await res.json();
                                      showMessage("Failed to create inquiry: " + err.message);
                                    }
                                  } catch (err) {
                                    console.error(err);
                                    showMessage("Something went wrong while adding the inquiry.");
                                  }
                                }}
                                className="button-save"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {isEditModalOpen && editingInquiry && (
                        <div className="modal-container">
                          <div className="modal-content">
                            <h2 className="text-2xl font-semibold mb-4" style={{ marginBottom: "3%" }}>
                              Edit Inquiry
                            </h2>
                            <form
                              onSubmit={async (e) => {
                                e.preventDefault();

                                try {
                                  const { attachments, ...inquiryDataWithoutAttachments } = editingInquiry;

                                  const res = await fetch("/api/inquiries", {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify(inquiryDataWithoutAttachments),
                                  });

                                  if (res.ok) {
                                    const updated = await res.json();
                                    setInquiries((prev) =>
                                      prev.map((inq) => (inq.id === updated.id ? updated : inq))
                                    );
                                    setIsEditModalOpen(false);
                                  } else {
                                    const err = await res.json();
                                    showMessage("Update failed: " + err.message);
                                  }
                                } catch (err) {
                                  console.error(err);
                                  showMessage("Something went wrong");
                                }
                              }}
                            >
                              <div className="grid grid-cols-2 gap-4">
                                <div className="form-row">
                                  <label htmlFor="companyName" style={{ fontWeight: "600" }}>Company Name</label>
                                  <input
                                    id="companyName"
                                    type="text"
                                    value={editingInquiry.companyName}
                                    onChange={(e) => setEditingInquiry({ ...editingInquiry, companyName: e.target.value })}
                                    required
                                    className="border p-2 rounded"
                                  />
                                </div>

                                <div className="form-row">
                                  <label htmlFor="contactPerson" style={{ fontWeight: "600" }}>Contact Person</label>
                                  <input
                                    id="contactPerson"
                                    type="text"
                                    value={editingInquiry.contactPerson}
                                    onChange={(e) => setEditingInquiry({ ...editingInquiry, contactPerson: e.target.value })}
                                    className="border p-2 rounded"
                                  />
                                </div>

                                <div className="form-row">
                                  <label htmlFor="email" style={{ fontWeight: "600" }}>Email</label>
                                  <input
                                    id="email"
                                    type="email"
                                    value={editingInquiry.email}
                                    onChange={(e) => setEditingInquiry({ ...editingInquiry, email: e.target.value })}
                                    className="border p-2 rounded"
                                  />
                                </div>

                                <div className="form-row">
                                  <label htmlFor="phone" style={{ fontWeight: "600" }}>Phone</label>
                                  <input
                                    id="phone"
                                    type="text"
                                    value={editingInquiry.phone}
                                    onChange={(e) => setEditingInquiry({ ...editingInquiry, phone: e.target.value })}
                                    className="border p-2 rounded"
                                  />
                                </div>

                                <div className="form-row">
                                  <label htmlFor="budget" style={{ fontWeight: "600" }}>Budget</label>
                                  <input
                                    id="budget"
                                    type="number"
                                    value={editingInquiry.budget ?? ""}
                                    onChange={(e) => setEditingInquiry({ ...editingInquiry, budget: Number(e.target.value) })}
                                    className="border p-2 rounded"
                                  />
                                </div>
                              </div>

                              <div className="form-row">
                                <label htmlFor="requirements" style={{ fontWeight: "600" }}>Requirements</label>
                                <textarea
                                  id="requirements"
                                  value={editingInquiry.requirements ?? ""}
                                  onChange={(e) =>
                                    setEditingInquiry({ ...editingInquiry, requirements: e.target.value })
                                  }
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

                      {/* Pagination Controls for Inquiries */}
                      <div className="pagination-controls">
                        <button
                          onClick={() => handlePageChangeForInquiries(currentPageForInquiries - 1)}
                          disabled={currentPageForInquiries === 1}
                          className="pagination-btn"
                        >
                          « Previous
                        </button>

                        <span>Page {currentPageForInquiries} of {totalPagesForInquiries}</span>

                        <button
                          onClick={() => handlePageChangeForInquiries(currentPageForInquiries + 1)}
                          disabled={currentPageForInquiries === totalPagesForInquiries}
                          className="pagination-btn"
                        >
                          Next »
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
{/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */}
              {/* Users */}
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
                        <i className="bx bx-plus icon cursor-pointer" onClick={() => setIsAddUserModalOpen(true)}></i>
                      </div>
                      <table>
                        <thead>
                          <tr>
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
                              <tr key={user.id} className="border-t" style={{ textAlign: "center" }}>
                                <td style={{ padding: "16px" }}>
                                  <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: "100%",
                                    minHeight: "50px", // Adjust if needed
                                    textAlign: "center",
                                  }}>
                                    {user.id}
                                  </div>
                                </td>
                                <td className="py-2 px-4">{user.name}</td>
                                <td className="py-2 px-4">{user.email}</td>
                                <td className="py-2 px-4">{user.role}</td>
                                <td>
                                  {/* Edit and Delete buttons */}
                                  <button
                                    onClick={() => {
                                      setEditingUser(user);
                                      setIsEditModalOpen(true);
                                    }}
                                    className="edit-btn"
                                    style={{ marginRight: "10px" }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => {
                                      setUserToDelete(user.id);
                                      setPropertyToDelete(null); // clear other type
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
                              <td colSpan={4} className="py-4 text-center">No users found</td>
                            </tr>
                          )}
                        </tbody>
                      </table>

                      {isEditModalOpen && editingUser && (
                        <div className="modal-container">
                          <div className="modal-content">
                            <h2 className="text-2xl font-semibold mb-4" style={{ marginBottom: "3%" }}>
                              Edit User
                            </h2>

                            <form
                              onSubmit={async (e) => {
                                e.preventDefault();
                                try {
                                  const res = await fetch("/api/users", {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify(editingUser),
                                  });

                                  if (res.ok) {
                                    const updated = await res.json();
                                    setUsers((prev) =>
                                      prev.map((user) => (user.id === updated.id ? updated : user))
                                    );
                                    setIsEditModalOpen(false);
                                    await fetchUsers();
                                  } else {
                                    const err = await res.json();
                                    showMessage("Update failed: " + (err.error || "Unknown error"));
                                  }
                                } catch (err) {
                                  console.error(err);
                                  showMessage("Something went wrong");
                                }
                              }}
                            >
                              <div className="grid grid-cols-2 gap-4">
                                <div className="form-row">
                                  <label htmlFor="name" style={{ fontWeight: "600" }}>Name</label>
                                  <input
                                    id="name"
                                    type="text"
                                    value={editingUser.name}
                                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                    className="border p-2 rounded"
                                    required
                                  />
                                </div>

                                <div className="form-row">
                                  <label htmlFor="email" style={{ fontWeight: "600" }}>Email</label>
                                  <input
                                    id="email"
                                    type="email"
                                    value={editingUser.email}
                                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                    className="border p-2 rounded"
                                    required
                                  />
                                </div>

                                <div className="form-row">
                                  <label htmlFor="role" style={{ fontWeight: "600" }}>Role</label>
                                  <select
                                    id="role"
                                    value={editingUser.role}
                                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                                    className="border p-2 rounded"
                                    required
                                  >
                                    <option value="admin">Admin</option>
                                    <option value="staff">Staff</option>
                                  </select>
                                </div>

                                <div className="form-row">
                                  <label htmlFor="status" style={{ fontWeight: "600" }}>Status</label>
                                  <select
                                    id="status"
                                    value={editingUser.status}
                                    onChange={(e) => setEditingUser({ ...editingUser, status: Number(e.target.value) })}
                                    className="border p-2 rounded"
                                    required
                                  >
                                    <option value={1}>Active</option>
                                    <option value={0}>Inactive</option>
                                  </select>
                                </div>
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

                      {isAddUserModalOpen && (
                        <div className="modal-container" onClick={() => setIsAddUserModalOpen(false)}>
                          <div className="modal-content-add" onClick={(e) => e.stopPropagation()}>
                            <h2 className="text-xl font-semibold mb-4" style={{ marginBottom: "3%" }}>Add New User</h2>

                            <button
                              className="modal-close-btn"
                              onClick={() => setIsAddUserModalOpen(false)}
                              aria-label="Close"
                            >
                              &times;
                            </button>

                            {/* Form Fields */}
                            <div className="grid grid-cols-2 gap-4">
                              <div className="form-row-add">
                                <input
                                  type="text"
                                  placeholder="Name"
                                  value={newUser.name}
                                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                  className="border p-2 rounded"
                                  required
                                />
                              </div>

                              <div className="form-row-add">
                                <input
                                  type="email"
                                  placeholder="Email"
                                  value={newUser.email}
                                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                  className="border p-2 rounded"
                                  required
                                />
                              </div>

                              <div className="form-row-add">
                                <input
                                  type="password"
                                  placeholder="Password"
                                  value={newUser.password}
                                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                  className="border p-2 rounded"
                                  required
                                />
                              </div>

                              <div className="form-row-add">
                                <select
                                  value={newUser.role}
                                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                  className="border p-2 rounded"
                                  required
                                >
                                  <option value="" disabled>Select Role</option>
                                  <option value="admin">Admin</option>
                                  <option value="staff">Staff</option>
                                </select>
                              </div>

                              <div className="form-row-add">
                                <select
                                  value={newUser.status}
                                  onChange={(e) => setNewUser({ ...newUser, status: Number(e.target.value) })}
                                  className="border p-2 rounded"
                                >
                                  <option value={1}>Active</option>
                                  <option value={0}>Inactive</option>
                                </select>
                              </div>
                            </div>

                            {/* Save Button */}
                            <div className="button-container">
                              <button
                                onClick={async () => {
                                  try {
                                    const res = await fetch("/api/users", {
                                      method: "POST",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify(newUser),
                                    });

                                    if (res.ok) {
                                      const created = await res.json();
                                      setUsers((prev) => [...prev, created]);
                                      setIsAddUserModalOpen(false);

                                      // Refresh
                                      await fetchUsers?.();

                                      // Reset form
                                      setNewUser({
                                        name: "",
                                        email: "",
                                        password: "",
                                        role: "",
                                        status: 1,
                                      });
                                    } else {
                                      const err = await res.json();
                                      showMessage("Failed to create user: " + (err.error || "Unknown error"));
                                    }
                                  } catch (err) {
                                    console.error(err);
                                    showMessage("Something went wrong while adding the user.");
                                  }
                                }}
                                className="button-save"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {isDeleteModalOpen && (
                        <div className="modal-overlay">
                          <div className="modal-content-delete">
                            <h3>Confirm Delete</h3>
                            <p>
                              Are you sure you want to delete this{" "}
                              {userToDelete ? "user" : "property"}?
                            </p>
                            <div className="modal-buttons">
                              <button
                                className="button-cancel"
                                onClick={() => setIsDeleteModalOpen(false)}
                              >
                                Cancel
                              </button>
                              <button
                                className="button-delete"
                                onClick={async () => {
                                  if (userToDelete !== null) {
                                    await handleDeleteUser(userToDelete);
                                  } else if (propertyToDelete !== null) {
                                    await handleDeleteProperties(propertyToDelete);
                                  }
                                  setIsDeleteModalOpen(false);
                                  await fetchUsers();
                                }}
                              >
                                Yes, Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Pagination Controls */}
                      <div className="pagination-controls">
                        <button
                          onClick={() => handlePageChangeForUsers(currentPageForUsers - 1)}
                          disabled={currentPageForUsers === 1}
                          className="pagination-btn"
                        >
                          « Previous
                        </button>

                        <span>Page {currentPageForUsers} of {totalPagesForUsers}</span>

                        <button
                          onClick={() => handlePageChangeForUsers(currentPageForUsers + 1)}
                          disabled={currentPageForUsers === totalPagesForUsers}
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