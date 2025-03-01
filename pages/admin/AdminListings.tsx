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

const AdminListings = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [newProperty, setNewProperty] = useState({ name: "", description: "", price: 0, type: "" });
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch Listings
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/properties");
      setProperties(res.data);
    } catch (error) {
      console.error("Error fetching properties", error);
    } finally {
      setLoading(false);
    }
  };

  // Create Property
  const createProperty = async () => {
    try {
      const res = await axios.post("/api/properties", newProperty);
      setProperties([...properties, res.data]);
      setNewProperty({ name: "", description: "", price: 0, type: "" });
    } catch (error) {
      console.error("Error creating property", error);
    }
  };

  // Update Property
  const updateProperty = async () => {
    if (!editingProperty) return;
    try {
      const res = await axios.put(`/api/properties/${editingProperty.id}`, editingProperty);
      setProperties(properties.map((p) => (p.id === editingProperty.id ? res.data : p)));
      setEditingProperty(null);
    } catch (error) {
      console.error("Error updating property", error);
    }
  };

  // Delete Property
  const deleteProperty = async (id: number) => {
    try {
      await axios.delete(`/api/properties/${id}`);
      setProperties(properties.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting property", error);
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
            <Input 
              placeholder="Property Name" 
              value={newProperty.name} 
              onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })} 
            />
            <Input 
              placeholder="Location Type" 
              value={newProperty.type} 
              onChange={(e) => setNewProperty({ ...newProperty, type: e.target.value })} 
            />
            <Textarea 
              placeholder="Description" 
              value={newProperty.description} 
              onChange={(e) => setNewProperty({ ...newProperty, description: e.target.value })} 
            />
            <Input 
              type="number" 
              placeholder="Price" 
              value={newProperty.price} 
              onChange={(e) => setNewProperty({ ...newProperty, price: Number(e.target.value) })} 
            />
            <Button onClick={createProperty} className="flex items-center gap-2">
              <Upload size={16} /> Create Property
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? <p>Loading properties...</p> : (
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Latitude</TableHead>
                  <TableHead>Longitude</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell>{property.name}</TableCell>
                    <TableCell>{property.description}</TableCell>
                    <TableCell>${property.price}</TableCell>
                    <TableCell>{property.latitude}</TableCell>
                    <TableCell>{property.longitude}</TableCell>
                    <TableCell>{property.type}</TableCell>
                    <TableCell className="space-x-2">
                      <Button variant="outline" onClick={() => setEditingProperty(property)}>Edit</Button>
                      <Button variant="destructive" onClick={() => deleteProperty(property.id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminListings;