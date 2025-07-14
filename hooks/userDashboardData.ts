import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Property, Inquiry, User, Note, NewInquiry, NewProperty, NewUser } from "../types";

export function useDashboardData() {
  const router = useRouter();

  const itemsPerPage = 6;

  const [activeTab, setActiveTab] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [properties, setProperties] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [activeListings, setActiveListings] = useState(0);
  const [activeInquiries, setActiveInquiries] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);

  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);

  // Image modal
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [selectedInquiryId, setSelectedInquiryId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Modal and delete states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [editingInquiry, setEditingInquiry] = useState<Inquiry | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<number | null>(null);
  const [inquiryToDelete, setInquiryToDelete] = useState<number | null>(null);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Form data
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddInqModalOpen, setIsAddInqModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  const [newProperty, setNewProperty] = useState<NewProperty>({
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

  const [newInquiry, setNewInquiry] = useState<NewInquiry>({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    requirements: "",
    budget: null,
    attachments: [],
    status: 1,
  });

  const [newUser, setNewUser] = useState<NewUser>({
    name: "",
    email: "",
    password: "",
    role: "",
    status: 1,
  });

  const showMessage = (message: string) => {
    setModalMessage(message);
    setIsMessageModalOpen(true);
    setIsFadingOut(false);
    setTimeout(() => setIsFadingOut(true), 2500);
    setTimeout(() => {
      setIsMessageModalOpen(false);
      setModalMessage(null);
      setIsFadingOut(false);
    }, 3000);
  };

  // Note logic
  useEffect(() => {
    const stored = localStorage.getItem("userNotes");
    if (stored) setNotes(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("userNotes", JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (newNote.trim()) {
      setNotes([{ text: newNote, completed: false }, ...notes]);
      setNewNote("");
    }
  };

  const toggleNote = (index: number) => {
    const updated = [...notes];
    updated[index].completed = !updated[index].completed;
    setNotes(updated);
  };

  const deleteNote = (index: number) => {
    const updated = [...notes];
    updated.splice(index, 1);
    setNotes(updated);
  };

  // Theme logic
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

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Data fetchers
  const fetchProperties = async () => {
    try {
      const res = await fetch("/api/properties");
      const data = await res.json();
      const active = data.filter((p: any) => p.status === 1);
      setProperties(data);
      setActiveListings(active.length);
    } catch (err) {
      console.error("Failed to fetch properties", err);
    }
  };

  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/inquiries");
      const data = await res.json();
      const active = data.filter((inq: any) => inq.status === 1);
      setInquiries(active);
      setActiveInquiries(active.length);
    } catch (err) {
      console.error("Failed to fetch inquiries", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      const active = data.filter((user: any) => user.status === 1);
      setUsers(active);
      setActiveUsers(active.length);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    fetchProperties();
    fetchInquiries();
    fetchUsers();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const [currentPageForUsers, setCurrentPageForUsers] = useState(1);
  const [currentPageForProperties, setCurrentPageForProperties] = useState(1);
  const [currentPageForInquiries, setCurrentPageForInquiries] = useState(1);

  // Filter properties based on search term
  const filteredProperties = properties.filter(property =>
    property.status === 1 && (
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.category.toLowerCase().includes(searchTerm.toLowerCase())
      // add other search criteria if needed
    )
  );  

  // Filter inquires based on search term
  const filteredInquiries = inquiries.filter(inquiry =>
    inquiry.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (inquiry.requirements ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );  

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Users pagination
  const startIndexUsers = (currentPageForUsers - 1) * itemsPerPage;
  const endIndexUsers = startIndexUsers + itemsPerPage;
  const usersToDisplay = filteredUsers.slice(startIndexUsers, endIndexUsers);

  // Properties pagination
  const startIndexProperties = (currentPageForProperties - 1) * itemsPerPage;
  const endIndexProperties = startIndexProperties + itemsPerPage;
  const propertiesToDisplay = filteredProperties.slice(startIndexProperties, endIndexProperties);

  // Inquiries pagination
  const startIndexInquiries = (currentPageForInquiries - 1) * itemsPerPage;
  const endIndexInquiries = startIndexInquiries + itemsPerPage;
  const inquiriesToDisplay = filteredInquiries.slice(startIndexInquiries, endIndexInquiries);

  const totalPagesForUsers = Math.ceil(filteredUsers.length / itemsPerPage);
  const totalPagesForProperties = Math.ceil(filteredProperties.length / itemsPerPage);
  const totalPagesForInquiries = Math.ceil(inquiries.length / itemsPerPage);

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
          await fetchProperties();
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
  
    const handleDeleteInquiry = async (inquiryID: number) => {
      try {
        const inquiryToUpdate = inquiries.find((inq) => inq.id === inquiryID);
        if (!inquiryToUpdate) {
          alert("Inquiry not found.");
          return;
        }
  
        const updatedInquiry = {
          ...inquiryToUpdate,       
          status: 0,              
        };
  
        const res = await fetch("/api/inquiries", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedInquiry), 
        });
  
        if (res.ok) {
          const updated = await res.json();
          setInquiries((prev) =>
            prev.filter((inq) => inq.id !== inquiryID)
          );
          await fetchInquiries();
          showMessage("Inquiry successfully deleted.");
        } else {
          const err = await res.json();
          showMessage("Delete failed: " + err.message);
        }
      } catch (err) {
        console.error(err);
        showMessage("Something went wrong during delete.");
      }
    };
  
    const handleDeleteUser = async (id: number) => {
      try {
        const res = await fetch(`/api/users?id=${id}`, {
          method: "DELETE",
        });
  
        if (res.ok) {
          setUsers((prev) =>
            prev.map((user) =>
              user.id === id ? { ...user, status: 0 } : user
            )
          );
          setModalMessage("User marked as inactive.");
        } else {
          const err = await res.json();
          setModalMessage("Failed to deactivate user: " + err.message);
        }
      } catch (err) {
        console.error(err);
        setModalMessage("Something went wrong while deactivating the user.");
      } finally {
        setIsMessageModalOpen(true);
        setTimeout(() => setIsMessageModalOpen(false), 2000);
      }
    };

  return {
    // State exports
    itemsPerPage,
    properties,
    setProperties,
    inquiries,
    setInquiries,
    users,
    setUsers,
    notes,
    newNote,
    setNewNote,
    addNote,
    toggleNote,
    deleteNote,
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    darkMode,
    toggleDarkMode,
    handleLogout,
    showMessage,
    isImageModalOpen,
    setIsImageModalOpen,
    selectedImages,
    setSelectedImages,
    currentImageIndex,
    setCurrentImageIndex,
    selectedFile,
    setSelectedFile,
    selectedPropertyId,
    setSelectedPropertyId,
    selectedInquiryId,
    setSelectedInquiryId,
    isUploading,
    setIsUploading,
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
    modalMessage,
    isMessageModalOpen,
    isFadingOut,
    isAddModalOpen,
    setIsAddModalOpen,
    newProperty,
    setNewProperty,
    isAddInqModalOpen,
    setIsAddInqModalOpen,
    newInquiry,
    setNewInquiry,
    isAddUserModalOpen,
    setIsAddUserModalOpen,
    newUser,
    setNewUser,
    setModalMessage,
    setIsMessageModalOpen,
    fetchProperties,
    fetchInquiries,
    fetchUsers,
    activeListings,
    activeInquiries,
    activeUsers,
    currentPageForUsers,
    setCurrentPageForUsers,
    currentPageForProperties,
    setCurrentPageForProperties,
    currentPageForInquiries,
    setCurrentPageForInquiries,
    usersToDisplay,
    propertiesToDisplay,
    inquiriesToDisplay,
    totalPagesForProperties,
    totalPagesForInquiries,
    totalPagesForUsers,
    setIsFadingOut,
    imageFile,
    setImageFile,
    handleDeleteProperties,
    handleDeleteInquiry,
    handleDeleteUser,
  };
}