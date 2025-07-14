import React from "react";
import { NewProperty, Property } from "../../types/index";

interface AddPropertyFormProps {
  isOpen: boolean;
  onClose: () => void;
  newProperty: NewProperty;
  setNewProperty: React.Dispatch<React.SetStateAction<NewProperty>>;
  imageFile: File | null;
  setImageFile: React.Dispatch<React.SetStateAction<File | null>>;
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
  fetchProperties: () => Promise<void>;
}

const AddPropertyForm: React.FC<AddPropertyFormProps> = ({
  isOpen,
  onClose,
  newProperty,
  setNewProperty,
  imageFile,
  setImageFile,
  setProperties,
  fetchProperties,
}) => {
  if (!isOpen) return null;

  const handleAddProperty = async () => {
    try {
      let uploadedImagePath = "";

      // Upload image if selected
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("propertyId", "new");

        const uploadRes = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("Image upload failed");

        const uploadData = await uploadRes.json();
        uploadedImagePath = uploadData.newImagePath;
      }

      // Create property
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
        onClose();
        await fetchProperties();
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
  };

  return (
    <div className="modal-container" onClick={onClose}>
      <div className="modal-content-add" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-semibold mb-4">Add New Property</h2>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          &times;
        </button>

        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Title"
            value={newProperty.title}
            onChange={(e) => setNewProperty({ ...newProperty, title: e.target.value })}
            className="border p-2 rounded"
          />

          <select
            value={newProperty.category}
            onChange={(e) => setNewProperty({ ...newProperty, category: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="" disabled>Select Category</option>
            <option value="Corporate">Corporate</option>
            <option value="Retail">Retail</option>
            <option value="Residential">Residential</option>
          </select>

          <input
            type="number"
            placeholder="Price"
            value={newProperty.price ?? ""}
            onChange={(e) =>
              setNewProperty({ ...newProperty, price: e.target.value === "" ? null : Number(e.target.value) })
            }
            className="border p-2 rounded"
          />

          <input
            type="text"
            placeholder="Manager"
            value={newProperty.manager}
            onChange={(e) => setNewProperty({ ...newProperty, manager: e.target.value })}
            className="border p-2 rounded"
          />

          <input
            type="text"
            placeholder="Contact"
            value={newProperty.contact}
            onChange={(e) => setNewProperty({ ...newProperty, contact: e.target.value })}
            className="border p-2 rounded"
          />

          <select
            value={newProperty.district}
            onChange={(e) => setNewProperty({ ...newProperty, district: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="" disabled>Select District</option>
            {[
              "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha", "Hambantota", "Jaffna",
              "Kalutara", "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara", "Moneragala",
              "Mullaitivu", "Nuwara Eliya", "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya",
            ].map((district) => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>

          <select
            value={newProperty.type}
            onChange={(e) => setNewProperty({ ...newProperty, type: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="" disabled>Select Type</option>
            <option value="For Sale">For Sale</option>
            <option value="For Rent">For Rent</option>
            <option value="Wanted">Wanted</option>
          </select>

          <input
            type="number"
            placeholder="Latitude"
            value={newProperty.latitude ?? ""}
            onChange={(e) => setNewProperty({ ...newProperty, latitude: Number(e.target.value) })}
            className="border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Longitude"
            value={newProperty.longitude ?? ""}
            onChange={(e) => setNewProperty({ ...newProperty, longitude: Number(e.target.value) })}
            className="border p-2 rounded"
          />
        </div>

        <textarea
          placeholder="Description"
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
              if (file) setImageFile(file);
            }}
            className="border border-gray-300 rounded px-4 py-2 mt-2"
            style={{ color: "var(--dark)" }}
          />
        </div>

        <div className="button-container mt-4">
          <button onClick={handleAddProperty} className="button-save">
            Add Property
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPropertyForm;