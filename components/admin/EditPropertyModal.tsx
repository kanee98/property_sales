import React from "react";
import { Property } from "../../types/index";
import { useMessage } from "../../components/MessageBox";

interface EditPropertyModalProps {
  isOpen: boolean;
  editingProperty: Property | null;
  setEditingProperty: React.Dispatch<React.SetStateAction<Property | null>>;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
}

const EditPropertyModal: React.FC<EditPropertyModalProps> = ({
  isOpen,
  editingProperty,
  setEditingProperty,
  setIsEditModalOpen,
  setProperties,
}) => {
  if (!isOpen || !editingProperty) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { images, ...propertyDataWithoutImages } = editingProperty;

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
        showMessage("Response Saved Successfully!");
      } else {
        const err = await res.json();
        showMessage("Update failed: " + err.message);
      }
    } catch (err) {
      console.error(err);
      showMessage("Something went wrong");
    }
  };

  const { showMessage } = useMessage();

  return (
    <div className="modal-container" onClick={() => setIsEditModalOpen(false)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold mb-4" style={{ marginBottom: "3%" }}>
          Edit Property
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-row">
              <label htmlFor="title" className="font-semibold">
                Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="Title"
                value={editingProperty.title}
                onChange={(e) =>
                  setEditingProperty({ ...editingProperty, title: e.target.value })
                }
                required
                className="border p-2 rounded"
              />
            </div>
            <div className="form-row">
              <label htmlFor="category" className="font-semibold">
                Category
              </label>
              <select
                id="category"
                value={editingProperty.category}
                onChange={(e) =>
                  setEditingProperty({ ...editingProperty, category: e.target.value })
                }
                required
                className="border p-2 rounded"
              >
                <option value="Corporate">Corporate</option>
                <option value="Retail">Retail</option>
                <option value="Residential">Residential</option>
              </select>
            </div>
            <div className="form-row">
              <label htmlFor="price" className="font-semibold">
                Price (Rs.)
              </label>
              <input
                id="price"
                type="number"
                placeholder="Price"
                value={editingProperty.price ?? ""}
                onChange={(e) =>
                  setEditingProperty({ ...editingProperty, price: Number(e.target.value) })
                }
                className="border p-2 rounded"
              />
            </div>
            <div className="form-row">
              <label htmlFor="district" className="font-semibold">
                District
              </label>
              <select
                id="district"
                value={editingProperty.district}
                onChange={(e) =>
                  setEditingProperty({ ...editingProperty, district: e.target.value })
                }
                className="border p-2 rounded"
              >
                {[
                  "Ampara",
                  "Anuradhapura",
                  "Badulla",
                  "Batticaloa",
                  "Colombo",
                  "Galle",
                  "Gampaha",
                  "Hambantota",
                  "Jaffna",
                  "Kalutara",
                  "Kandy",
                  "Kegalle",
                  "Kilinochchi",
                  "Kurunegala",
                  "Mannar",
                  "Matale",
                  "Matara",
                  "Moneragala",
                  "Mullaitivu",
                  "Nuwara Eliya",
                  "Polonnaruwa",
                  "Puttalam",
                  "Ratnapura",
                  "Trincomalee",
                  "Vavuniya",
                ].map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <label htmlFor="manager" className="font-semibold">
                Manager
              </label>
              <input
                id="manager"
                type="text"
                placeholder="Manager"
                value={editingProperty.manager}
                onChange={(e) =>
                  setEditingProperty({ ...editingProperty, manager: e.target.value })
                }
                className="border p-2 rounded"
              />
            </div>
            <div className="form-row">
              <label htmlFor="type" className="font-semibold">
                Type
              </label>
              <select
                id="type"
                value={editingProperty.type}
                onChange={(e) =>
                  setEditingProperty({ ...editingProperty, type: e.target.value })
                }
                className="border p-2 rounded"
              >
                <option value="For Sale">For Sale</option>
                <option value="For Rent">For Rent</option>
                <option value="Wanted">Wanted</option>
              </select>
            </div>
            <div className="form-row">
              <label htmlFor="latitude" className="font-semibold">
                Latitude
              </label>
              <input
                id="latitude"
                type="number"
                placeholder="Latitude"
                value={editingProperty.latitude ?? ""}
                onChange={(e) =>
                  setEditingProperty({ ...editingProperty, latitude: Number(e.target.value) })
                }
                className="border p-2 rounded"
              />
            </div>
            <div className="form-row">
              <label htmlFor="longitude" className="font-semibold">
                Longitude
              </label>
              <input
                id="longitude"
                type="number"
                placeholder="Longitude"
                value={editingProperty.longitude ?? ""}
                onChange={(e) =>
                  setEditingProperty({ ...editingProperty, longitude: Number(e.target.value) })
                }
                className="border p-2 rounded"
              />
            </div>
            <div className="form-row">
              <label htmlFor="contact" className="font-semibold">
                Contact Number
              </label>
              <input
                id="contact"
                type="text"
                placeholder="Contact Number"
                value={editingProperty.contact}
                onChange={(e) =>
                  setEditingProperty({ ...editingProperty, contact: e.target.value })
                }
                className="border p-2 rounded"
              />
            </div>
          </div>
          <div className="form-row mt-4">
            <label htmlFor="description" className="font-semibold">
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
              className="border p-2 rounded w-full"
            />
          </div>

          <div className="button-container mt-4 flex justify-end gap-2">
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
  );
};

export default EditPropertyModal;