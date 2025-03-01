import AdminSidebar from "../../components/AdminSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
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

  const [properties, setProperties] = useState([
    { id: 1, name: "Luxury Villa", location: "New York, NY", images: 5 },
    { id: 2, name: "Modern Apartment", location: "Los Angeles, CA", images: 3 },
  ]);

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
    <AdminSidebar />
    <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Property Management</h1>
        <Dialog>
          <DialogTrigger>
            <Button>Add New Property</Button>
          </DialogTrigger>
          <DialogContent>
            <h2 className="text-xl font-semibold">Create New Property</h2>
            <Input placeholder="Property Name" />
            <Input placeholder="Location" />
            <Textarea placeholder="Description" />
            <Button className="flex items-center gap-2">
              <Upload size={16} /> Upload Images
            </Button>
            <Button>Create Property</Button>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Images</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>{property.name}</TableCell>
                  <TableCell>{property.location}</TableCell>
                  <TableCell>{property.images} images</TableCell>
                  <TableCell className="space-x-2">
                    <Button variant="outline">Edit</Button>
                    <Button variant="destructive">Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminListings;
