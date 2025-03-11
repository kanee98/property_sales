"use client"; 

import { useEffect, useState } from "react";
import "../components/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTag, faSyncAlt, faUser, faClipboardList, faThumbsUp } from "@fortawesome/free-solid-svg-icons";

interface Property {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  latitude: number;
  longitude: number;
  type: string; // Corporate or Retail
}

export default function ListingsPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    fetch("/api/properties")
      .then((res) => res.json())
      .then((data) => setProperties(data));
  }, []);

  const filteredProperties = properties.filter(
    (property) =>
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedType === "" || property.type === selectedType)
  );

  const redirectToLogin = () => {
    window.location.href = "/login";
  };

  return (
    <>
    <section className="landing">
      <div className="landing-bg"></div>     
      <header className="relative z-10 flex justify-between items-center px-10 py-5">
        <h1 className="text-3xl font-bold">Prime Ceylon</h1>
        <nav className="space-x-4">
          <button type="button" className="border p-2 rounded w-15" onClick={redirectToLogin}>
            Login
          </button>
        </nav>
      </header>    
      <div className="landing-message">
        <h3 className="text-2xl font-semibold">Relax, Finding Properties Just Got Easier</h3>
        <p className="text-lg mt-2">Discover the best properties for sale or rent</p>
        <form className="mt-5 flex justify-center pb-[8%]">
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Search properties..."
              className="border p-2 rounded w-full"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="border p-2 rounded"
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="" style={{ color: "black" }}>All Types</option>
              <option value="Corporate" style={{ color: "black" }}>Corporate</option>
              <option value="Retail" style={{ color: "black" }}>Retail</option>
            </select>
          </div>
        </form>
      </div>
      
      <div className="stats">
        <div className="stat left-corner">
          <h2 className="text-3xl font-bold">6</h2>
          <p>Total Properties</p>
        </div>
        <div className="stat">
          <h2 className="text-3xl font-bold">3</h2>
          <p>Coporate</p>
        </div>
        <div className="stat">
          <h2 className="text-3xl font-bold">1</h2>
          <p>Retail</p>
        </div>
        <div className="stat right-corner">
          <h2 className="text-3xl font-bold">2</h2>
          <p>Lands</p>
        </div>
      </div>
    </section>

    <div className="container mx-auto p-4">
      {/* Property Cards */}
      <div className="grid grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <div key={property.id} className="border p-4 rounded-lg shadow-lg">
            <img
              src={property.image}
              alt={property.name}
              className="w-full h-48 object-cover rounded-md"
            />
            <h2 className="text-lg font-semibold mt-2">{property.name}</h2>
            <p>{property.description}</p>
            <p className="font-bold text-green-600">${property.price}</p>

            {/* Google Maps */}
            <iframe
              src={`https://maps.google.com/maps?q=${property.latitude},${property.longitude}&z=15&output=embed`}
              width="100%"
              height="200"
              className="mt-2 rounded-md"
            ></iframe>
          </div>
        ))}
      </div>
    </div>

    {/* <section className="whyChooseUs">
      <h4 className="title">Why Choose Us?</h4>
      <hr className="titleMark"/>
      <div className="reasons">
        <div className="reason">
          <FontAwesomeIcon icon={faCheck} size="2x" />
          <div className="reason-text">
            <h3>Quick</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum ipsa, a fuga sed maxime beatae earum tenetur possimus dignissimos ea.</p>
          </div>
        </div>
        <div className="reason">
          <FontAwesomeIcon icon={faTag} size="2x" />
          <div className="reason-text">
            <h3>Free</h3>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laborum obcaecati sit nihil porro molestias consectetur dolore, laudantium recusandae iure quasi!</p>
          </div>
        </div>
        <div className="reason">
          <FontAwesomeIcon icon={faSyncAlt} size="2x" />
          <div className="reason-text">
            <h3>Easy</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda veritatis commodi officia tempore nulla doloribus officiis cupiditate ducimus consequatur ut?</p>
          </div>
        </div>
        <div className="reason">
          <FontAwesomeIcon icon={faUser} size="2x" />
          <div className="reason-text">
            <h3>Independent</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa voluptate culpa sunt itaque minima harum explicabo placeat dolores maiores consequuntur?</p>
          </div>
        </div>
    
        <div className="reason">
          <FontAwesomeIcon icon={faThumbsUp} size="2x" />
          <div className="reason-text">
            <h3>Awesome</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi quia, illum et deserunt temporibus omnis neque similique aut inventore in!</p>
          </div>
        </div>
      </div>
    </section> */}
    </>
  );
}
