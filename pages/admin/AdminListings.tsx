import { useEffect, useState } from "react";
import axios from "axios";

interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
}

const AdminListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [newListing, setNewListing] = useState({ title: "", description: "", price: 0 });
  const [editingListing, setEditingListing] = useState<Listing | null>(null);

  // Fetch Listings
  useEffect(() => {
    axios.get("/api/listings")
      .then((res) => setListings(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Create Listing
  const createListing = async () => {
    try {
      const res = await axios.post("/api/listings", newListing);
      setListings([...listings, res.data]);
      setNewListing({ title: "", description: "", price: 0 });
    } catch (error) {
      console.error("Error creating listing", error);
    }
  };

  // Update Listing
  const updateListing = async () => {
    if (!editingListing) return;
    try {
      const res = await axios.put(`/api/listings/${editingListing.id}`, editingListing);
      setListings(listings.map((l) => (l.id === editingListing.id ? res.data : l)));
      setEditingListing(null);
    } catch (error) {
      console.error("Error updating listing", error);
    }
  };

  // Delete Listing
  const deleteListing = async (id: number) => {
    try {
      await axios.delete(`/api/listings/${id}`);
      setListings(listings.filter((l) => l.id !== id));
    } catch (error) {
      console.error("Error deleting listing", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Listings</h2>

      {/* Create New Listing Form */}
      <div className="p-4 border rounded">
        <h3 className="text-lg font-semibold mb-2">Add New Listing</h3>
        <input className="border p-2 w-full" type="text" placeholder="Title" value={newListing.title} onChange={(e) => setNewListing({ ...newListing, title: e.target.value })} />
        <textarea className="border p-2 w-full mt-2" placeholder="Description" value={newListing.description} onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}></textarea>
        <input className="border p-2 w-full mt-2" type="number" placeholder="Price" value={newListing.price} onChange={(e) => setNewListing({ ...newListing, price: Number(e.target.value) })} />
        <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded" onClick={createListing}>Add Listing</button>
      </div>

      {/* Listings Table */}
      <table className="mt-6 w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Title</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((listing) => (
            <tr key={listing.id} className="border">
              <td className="p-2">{listing.title}</td>
              <td className="p-2">{listing.description}</td>
              <td className="p-2">${listing.price}</td>
              <td className="p-2">
                <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2" onClick={() => setEditingListing(listing)}>Edit</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => deleteListing(listing.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Listing Form */}
      {editingListing && (
        <div className="mt-4 p-4 border rounded">
          <h3 className="text-lg font-semibold">Edit Listing</h3>
          <input className="border p-2 w-full" type="text" value={editingListing.title} onChange={(e) => setEditingListing({ ...editingListing, title: e.target.value })} />
          <textarea className="border p-2 w-full mt-2" value={editingListing.description} onChange={(e) => setEditingListing({ ...editingListing, description: e.target.value })}></textarea>
          <input className="border p-2 w-full mt-2" type="number" value={editingListing.price} onChange={(e) => setEditingListing({ ...editingListing, price: Number(e.target.value) })} />
          <button className="mt-2 bg-green-500 text-white px-4 py-2 rounded" onClick={updateListing}>Save Changes</button>
        </div>
      )}
    </div>
  );
};

export default AdminListings;
