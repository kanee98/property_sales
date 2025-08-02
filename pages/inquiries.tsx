import Link from 'next/link';
import Image from 'next/image';
import 'boxicons/css/boxicons.min.css';
import '../components/dashboard.css';
import SidebarScript from "../components/SidebarScript"; 
import { useEffect, useRef, useState } from "react";
import Logo from "../src/img/Propwise Logo No BG.png";
import "../components/inquiries.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTags, faSyncAlt, faUserTie, faThumbsUp, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { NewInquiry} from "../types";
import { useMessage } from "../components/MessageBox";

export default function InquiriesPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("inquiries");

  const { showMessage } = useMessage();

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

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [newInquiry, setNewInquiry] = useState<NewInquiry>({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    budget: null,
    requirements: "",
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
        showMessage("Inquiry submitted successfully");
        setNewInquiry({
          companyName: "",
          contactPerson: "",
          email: "",
          phone: "",
          budget: null,
          requirements: "",
          attachments: [],
          status: 1,
        });

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setImageFile(null);
      } else {
        const err = await res.json();
        showMessage("Failed to create inquiry: " + err.message);
      }
    } catch (err) {
      console.error(err);
      showMessage("Something went wrong while adding the inquiry.");
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
              <Link href="/" onClick={redirectToListings} className="listings">
                <i className="bx bx-arrow-back bx-sm bx-burst-hover"></i>
                <span className="text">Back to Listings</span>
              </Link>
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

                <div className="inquiry-wrapper">
                  <div className="inquiry-form-container">
                    <h2 className="inquiry-title">Submit New Inquiry</h2>

                    <form onSubmit={handleFormSubmit} encType="multipart/form-data" className="inquiry-form">
                      <div className="form-grid">
                        <input
                          type="text"
                          placeholder="Company Name"
                          value={newInquiry.companyName}
                          onChange={(e) => setNewInquiry({ ...newInquiry, companyName: e.target.value })}
                          required
                        />
                        <input
                          type="text"
                          placeholder="Contact Person"
                          value={newInquiry.contactPerson}
                          onChange={(e) => setNewInquiry({ ...newInquiry, contactPerson: e.target.value })}
                          required
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          value={newInquiry.email}
                          onChange={(e) => setNewInquiry({ ...newInquiry, email: e.target.value })}
                          required
                        />
                        <input
                          type="text"
                          placeholder="Phone"
                          value={newInquiry.phone}
                          onChange={(e) => setNewInquiry({ ...newInquiry, phone: e.target.value })}
                          required
                        />
                        <input
                          type="number"
                          placeholder="Budget (Rs.)"
                          value={newInquiry.budget ?? ""}
                          onChange={(e) => setNewInquiry({ ...newInquiry, budget: Number(e.target.value) })}
                        />
                      </div>

                      <textarea
                        placeholder="Requirements"
                        value={newInquiry.requirements ?? ""}
                        onChange={(e) => setNewInquiry({ ...newInquiry, requirements: e.target.value })}
                        rows={3}
                      />

                      <div className="file-upload">
                        <label>Upload Image (optional)</label>
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setImageFile(file);
                          }}
                        />
                      </div>

                      <button type="submit" className="submit-btn">
                        Submit
                      </button>
                    </form>
                  </div>
                   <div className="contact-info-container">
                    <h3>Contact Us</h3>
                    <p>
                      <i className="bx bx-phone"></i>
                      <strong>Phone:</strong> +94 77 362 8282 / +94 77 736 6597
                    </p>
                    <p>
                      <i className="bx bx-envelope"></i>
                      <strong>Email:</strong> padmapriya@propwise.lk
                    </p>
                    <p>
                      <i className="bx bx-map"></i>
                      <strong>Address:</strong> 374/4/1 Narendrasinghe lane, Habarakada watta, Homagama
                    </p>
                    <p>
                      <i className="bx bx-time"></i>
                      <strong>Office Hours:</strong> Mon - Sat, 9am - 5pm
                    </p>
                  </div>
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
                            <FontAwesomeIcon icon={faCheckCircle} size="2x" color="#28a745" />
                            <div className="reason-text">
                              <h3>Reliable Service</h3>
                              <p>
                                We pride ourselves on offering reliable and transparent service. 
                                Every transaction is handled with utmost professionalism, ensuring your trust is well placed.
                                Our dedicated support team is always ready to assist you throughout your property journey.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="table-data" style={{marginTop:"0"}}>
                          <div className="reason">
                            <FontAwesomeIcon icon={faTags} size="2x" color="#ff6600" />
                            <div className="reason-text">
                              <h3>Competitive Pricing</h3>
                              <p>
                                Find the best deals tailored to your budget. 
                                We provide transparent pricing with no hidden fees, so you can make informed decisions. 
                                Our market experts constantly update listings to ensure you get great value.
                              </p>
                            </div>
                          </div>
                        </div>
                      </ul>

                      <ul className="box-info" style={{marginTop:"0"}}>
                        <div className="table-data" style={{marginTop:"0"}}>
                          <div className="reason">
                            <FontAwesomeIcon icon={faSyncAlt} size="2x" color="#007bff" />
                            <div className="reason-text">
                              <h3>Seamless Process</h3>
                              <p>
                                Experience a smooth, hassle-free process from start to finish. 
                                Our platform simplifies inquiries, negotiations, and paperwork. 
                                We ensure timely updates and efficient communication at every step.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="table-data" style={{marginTop:"0"}}>
                          <div className="reason">
                            <FontAwesomeIcon icon={faUserTie} size="2x" color="#6f42c1"/>
                            <div className="reason-text">
                              <h3>Expert Agents</h3>
                              <p>
                                Work with experienced and professional agents who understand your needs. 
                                They provide tailored advice and local market insights to help you make smart choices. 
                                Our agents are committed to delivering personalized, attentive service.
                              </p>
                            </div>
                          </div>
                        </div>
                      </ul>

                      <ul className="box-info" style={{marginTop:"0"}}>
                        <div className="table-data" style={{marginTop:"0"}}>
                          <div className="reason">
                            <FontAwesomeIcon icon={faThumbsUp} size="2x" color="#17a2b8" />
                            <div className="reason-text">
                              <h3>Customer Satisfaction</h3>
                              <p>
                                Your satisfaction is our priority. 
                                We strive to exceed your expectations with quality service and attention to detail. 
                                Our client testimonials and repeat customers speak volumes about our commitment.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="table-data" style={{marginTop:"0"}}>
                          <div className="reason">
                            <FontAwesomeIcon icon={faShieldAlt} size="2x" color="#dc3545" />
                            <div className="reason-text">
                              <h3>Secure Transactions</h3>
                              <p>
                                We prioritize your safety with robust security measures protecting your data and payments. 
                                Every transaction on our platform follows industry best practices. 
                                Trust us to keep your information and assets secure at all times.
                              </p>
                            </div>
                          </div>
                        </div>
                      </ul>
                    </div>
                  </section>
                </div>
              )}

              {activeTab === "aboutus" && (
                <div className="aboutus-container p-6 max-w-4xl mx-auto">
                  <div className="head-title mb-6">
                    <div className="left">
                      <h1 className="text-3xl font-bold mb-2">About Us</h1>
                      <ul className="breadcrumb flex items-center text-gray-600 space-x-2">
                        <li>
                          <Link href="#" className="hover:underline">About Us</Link>
                        </li>
                        <li><i className='bx bx-chevron-right'></i></li>
                        <li>
                          <Link href="#" className="active text-blue-600 font-semibold">Who We Are</Link>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <section className="about-us-content space-y-6 text-gray-700 leading-relaxed">
                    <h2 className="text-2xl font-semibold" style={{ marginBottom: "1rem", marginTop: "1rem" }}>Our Story</h2>
                    <p>
                      Welcome to PropWise.lk — Sri Lanka’s trusted partner in property sales, rentals, and real estate management. 
                      With over 15 years of industry expertise, we are committed to delivering exceptional property solutions that 
                      empower individuals, families, and investors to make confident decisions in today’s competitive real estate market.
                    </p>
                    <p>
                      Our journey began with a clear mission: to simplify the property experience in Sri Lanka through innovation, 
                      integrity, and deep market insight. From residential homes and commercial spaces to land plots and property 
                      management services, we bring you a comprehensive platform backed by decades of local knowledge and proven success.
                    </p>
                    <p>
                      At PropWise.lk, we believe real estate should be easy, transparent, and client-focused. That’s why our expert team 
                      combines advanced technology with personalized support to provide access to accurate listings, verified properties, 
                      and tailored advice that meets your unique needs — whether you're a first-time buyer, seasoned investor, landlord, or simply exploring your options.
                    </p>
                    <p>
                      We take pride in our values:
                      <ul>
                        <li>✅ Trust — every listing is verified and reliable</li>
                        <li>✅ Transparency — honest guidance at every step</li>
                        <li>✅ Satisfaction — your goals are our priority</li>
                      </ul>
                    </p>
                    <p>
                      Join thousands of satisfied clients who have turned to PropWise.lk to buy, sell, rent, or manage properties with ease. We're not just another property website — we’re your strategic real estate partner in Sri Lanka.
                    </p>
                  </section>

                  <section className="leadership mt-10">
                    <h2 className="text-2xl font-semibold mb-6" style={{ marginBottom: "1rem"}}>Meet Our Leadership</h2>
                    <div className="leaders-grid">
                      <div className="leader">
                        <Image
                          src="/img/kandy1.jpg"
                          alt="CEO"
                          width={150} 
                          height={150}
                          style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                            borderRadius: "50%",
                            border: "2px solid #ccc",
                            display: "block",
                            margin: "0 auto",
                          }}
                        />
                        <h3 className="leader-name">Padmapriya Jayasinghe</h3>
                        <p className="leader-title">Managing Director </p>
                      </div>

                      <div className="leader">
                        <Image
                          src="/img/property1.jpg"
                          alt="COO"
                          width={150}
                          height={150}
                          style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                            borderRadius: "50%", 
                            border: "2px solid #ccc",
                            display: "block",
                            margin: "0 auto",
                          }}
                        />
                        <h3 className="leader-name">Danesh Jayasinghe </h3>
                        <p className="leader-title">CEO (Partner)</p>
                      </div>
                    </div>
                  </section>
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