// components/admin/PropertyTable.tsx
import React from "react";
import { Property } from "../../types/index"; // adjust the import path if needed

interface PropertyTableProps {
  properties: Property[];
  setEditingProperty: (property: Property) => void;
  setIsEditModalOpen: (value: boolean) => void;
  setPropertyToDelete: (id: number) => void;
  setIsDeleteModalOpen: (value: boolean) => void;
  setSelectedPropertyId: (id: number) => void;
  setSelectedImages: (images: string[]) => void;
  setCurrentImageIndex: (index: number) => void;
  setIsImageModalOpen: (value: boolean) => void;
}

const PropertyTable: React.FC<PropertyTableProps> = ({
  properties,
  setEditingProperty,
  setIsEditModalOpen,
  setPropertyToDelete,
  setIsDeleteModalOpen,
  setSelectedPropertyId,
  setSelectedImages,
  setCurrentImageIndex,
  setIsImageModalOpen,
}) => {
  return (
    <tbody>
      {properties.length > 0 ? (
        properties.map((property) => (
          <tr key={property.id}>
            <td style={{ padding: "16px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  minHeight: "50px",
                  textAlign: "center",
                }}
              >
                {property.id}
              </div>
            </td>
            <td
              style={{
                whiteSpace: "normal",
                maxWidth: "200px",
                padding: "12px 16px",
              }}
            >
              {property.title}
            </td>
            <td
              style={{
                whiteSpace: "normal",
                maxWidth: "300px",
                padding: "12px 16px",
              }}
            >
              {property.description}
            </td>
            <td>
              {property.price != null
                ? `Rs. ${property.price.toLocaleString()}`
                : "N/A"}
            </td>
            <td>{property.category}</td>
            <td>{property.manager}</td>
            <td>{property.contact}</td>
            <td>{property.district}</td>
            <td>{property.type}</td>
            <td style={{ padding: "16px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  minHeight: "50px",
                  textAlign: "center",
                }}
              >
                <button
                  className="view-btn"
                  onClick={async () => {
                    try {
                      const res = await fetch(`/api/properties`);
                      const properties: Property[] = await res.json();
                      const updatedProperty = properties.find(
                        (p) => p.id === property.id
                      );

                      if (!updatedProperty) {
                        console.error("Property not found");
                        return;
                      }

                      let images: string[] = [];
                      try {
                        const parsed = JSON.parse(
                          updatedProperty.images as unknown as string
                        );
                        images = Array.isArray(parsed) ? parsed : [];
                      } catch (err) {
                        console.error("Error parsing images:", err);
                        images = [];
                      }

                      setSelectedPropertyId(updatedProperty.id);
                      setSelectedImages(images);
                      setCurrentImageIndex(0);
                      setIsImageModalOpen(true);
                    } catch (err) {
                      console.error("Failed to reload properties:", err);
                    }
                  }}
                >
                  View
                </button>
              </div>
            </td>

            <td>
              <button
                onClick={() => {
                  setEditingProperty(property);
                  setIsEditModalOpen(true);
                }}
                className="edit-btn"
                style={{ marginRight: "10px" }}
              >
                Edit
              </button>

              <button
                onClick={() => {
                  setPropertyToDelete(property.id);
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
          <td colSpan={11} className="py-4 text-center">
            No properties found
          </td>
        </tr>
      )}
    </tbody>
  );
};

export default PropertyTable;