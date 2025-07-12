import Link from 'next/link';
import Image from 'next/image';
import 'boxicons/css/boxicons.min.css';
import '../components/dashboard.css';
import SidebarScript from "../components/SidebarScript"; 
import { useEffect, useState } from "react";
import Logo from "../src/img/Propwise Logo No BG.png";
import "../components/inquiries.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTag, faSyncAlt, faUser, faThumbsUp } from "@fortawesome/free-solid-svg-icons";

export default function InquiriesPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("inquiries");

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

  const redirectToListings = () => {
    window.location.href = "/";
  };

  const [newInquiry, setNewInquiry] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    budget: null,
    requirements: null,
    attachments: [],
    status: 1,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

        if (!uploadRes.ok) throw new Error("Image upload failed");

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
        alert("Inquiry submitted successfully");
        setNewInquiry({
          companyName: "",
          contactPerson: "",
          email: "",
          phone: "",
          budget: null,
          requirements: null,
          attachments: [],
          status: 1,
        });
        setImageFile(null);
      } else {
        const err = await res.json();
        alert("Failed to create inquiry: " + err.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while adding the inquiry.");
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
            <li className={activeTab === "inquiries" ? "active" : ""}>
              <Link href="#" onClick={() => setActiveTab("inquiries")} className="nav-link">
                <i className='bx bxs-phone-incoming bx-sm'></i>
                <span className="text">Inquiries</span>
              </Link>
            </li>
            <li className={activeTab === "whyus" ? "active" : ""}>
              <Link href="#" onClick={() => setActiveTab("whyus")} className="nav-link">
                <i className='bx bxs-star bx-sm'></i>
                <span className="text">Why Choose Us</span>
              </Link>
            </li>
            <li className={activeTab === "aboutus" ? "active" : ""}>
              <Link href="#" onClick={() => setActiveTab("aboutus")} className="nav-link">
                <i className='bx bxs-info-circle bx-sm'></i>
                <span className="text">About Us</span>
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
              <a href="/" onClick={redirectToListings} className="listings">
                <i className="bx bx-arrow-back bx-sm bx-burst-hover"></i>
                <span className="text">Back to Listings</span>
              </a>
            </li>
          </ul>
        </section>

        <section id="content">
        <nav className="navbar">
            <i className='bx bx-menu bx-sm'></i>
            <form action="">
              <div className="form-input">
                
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
          </nav>
          <main>
            {activeTab === "inquiries" && (
              <>
                <div className="head-title">
                  <div className="left">
                    <h1>Inquiries</h1>
                    <ul className="breadcrumb">
                      <li><Link href="#">Inquiries</Link></li>
                      <li><i className='bx bx-chevron-right'></i></li>
                      <li><Link href="#" className="active">New Inquiry</Link></li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mt-4">
                  <h2 className="text-xl font-semibold mb-4">Submit New Inquiry</h2>

                  <form onSubmit={handleFormSubmit} encType="multipart/form-data">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Company Name"
                        value={newInquiry.companyName}
                        onChange={(e) => setNewInquiry({ ...newInquiry, companyName: e.target.value })}
                        className="border p-2 rounded"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Contact Person"
                        value={newInquiry.contactPerson}
                        onChange={(e) => setNewInquiry({ ...newInquiry, contactPerson: e.target.value })}
                        className="border p-2 rounded"
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={newInquiry.email}
                        onChange={(e) => setNewInquiry({ ...newInquiry, email: e.target.value })}
                        className="border p-2 rounded"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Phone"
                        value={newInquiry.phone}
                        onChange={(e) => setNewInquiry({ ...newInquiry, phone: e.target.value })}
                        className="border p-2 rounded"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Budget"
                        value={newInquiry.budget ?? ""}
                        onChange={(e) => setNewInquiry({ ...newInquiry, budget: Number(e.target.value) })}
                        className="border p-2 rounded"
                      />
                    </div>

                    <textarea
                      placeholder="Requirements"
                      value={newInquiry.requirements ?? ""}
                      onChange={(e) => setNewInquiry({ ...newInquiry, requirements: e.target.value })}
                      className="border p-2 rounded mt-4 w-full"
                      rows={3}
                    />

                    <div className="mt-4">
                      <label className="block font-semibold mb-2">Upload Image (optional)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setImageFile(file);
                        }}
                        className="border border-gray-300 rounded px-4 py-2"
                      />
                    </div>

                    <button type="submit" className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                      Submit
                    </button>
                  </form>
                </div>
              </>
            )}

              {activeTab === "whyus" && (
                <div className="p-6">
                  <div className="head-title">
                    <div className="left">
                      <h1>Why Choose Us?</h1>
                      <ul className="breadcrumb">
                        <li>
                          <Link href="#">Why Choose Us</Link>
                        </li>
                        <li><i className='bx bx-chevron-right'></i></li>
                        <li>
                          <Link href="#" className="active">Why Us</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <section className="whyChooseUs">              
                    <div className="reasons">
                        <ul className="box-info" style={{marginTop:"0"}}>
                            <div className="table-data" style={{marginTop:"0"}}>
                                <div className="reason">
                                <FontAwesomeIcon icon={faCheck} size="2x" />
                                    <div className="reason-text">
                                        <h3>Quick</h3>
                                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum ipsa, a fuga sed maxime beatae earum tenetur possimus dignissimos ea.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="table-data" style={{marginTop:"0"}}>
                                <div className="reason">
                                    <FontAwesomeIcon icon={faTag} size="2x" />
                                    <div className="reason-text">
                                        <h3>Free</h3>
                                        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laborum obcaecati sit nihil porro molestias consectetur dolore, laudantium recusandae iure quasi!</p>
                                    </div>
                                </div>
                            </div>
                        </ul>
                        <ul className="box-info" style={{marginTop:"0"}}>
                            <div className="table-data" style={{marginTop:"0"}}>
                                <div className="reason">
                                    <FontAwesomeIcon icon={faSyncAlt} size="2x" />
                                    <div className="reason-text">
                                        <h3>Easy</h3>
                                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda veritatis commodi officia tempore nulla doloribus officiis cupiditate ducimus consequatur ut?</p>
                                    </div>
                                </div>
                            </div>
                            <div className="table-data" style={{marginTop:"0"}}>
                                <div className="reason">
                                    <FontAwesomeIcon icon={faUser} size="2x" />
                                    <div className="reason-text">
                                        <h3>Independent</h3>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa voluptate culpa sunt itaque minima harum explicabo placeat dolores maiores consequuntur?</p>
                                    </div>
                                </div>
                            </div>
                        </ul>
                        <ul className="box-info" style={{marginTop:"0"}}>
                            <div className="table-data" style={{marginTop:"0"}}>
                                <div className="reason">
                                    <FontAwesomeIcon icon={faThumbsUp} size="2x" />
                                    <div className="reason-text">
                                        <h3>Awesome</h3>
                                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi quia, illum et deserunt temporibus omnis neque similique aut inventore in!</p>
                                    </div>
                                </div>
                            </div>
                            <div className="table-data" style={{marginTop:"0"}}>
                                <div className="reason">
                                    <FontAwesomeIcon icon={faSyncAlt} size="2x" />
                                    <div className="reason-text">
                                        <h3>Easy</h3>
                                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda veritatis commodi officia tempore nulla doloribus officiis cupiditate ducimus consequatur ut?</p>
                                    </div>
                                </div>
                            </div>
                        </ul>
                    </div>
                  </section>
                </div>
              )}

              {activeTab === "aboutus" && (
                <div className="p-6">
                  <div className="head-title">
                    <div className="left">
                      <h1>About Us</h1>
                      <ul className="breadcrumb">
                        <li>
                          <Link href="#">About Us</Link>
                        </li>
                        <li><i className='bx bx-chevron-right'></i></li>
                        <li>
                          <Link href="#" className="active">Who We Are</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="table-data">
                    <div className="order">
                    <div className="head">
                      <h3>About Us</h3>
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
                          
                        </tbody>
                      </table>
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
                          
                        </tbody>
                      </table>
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