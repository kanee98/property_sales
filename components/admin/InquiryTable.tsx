import React from "react";
import { Inquiry } from "../../types/index";

interface InquiryTableProps {
  inquiriesToDisplay: Inquiry[];
  setEditingInquiry: React.Dispatch<React.SetStateAction<Inquiry | null>>;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setInquiryToDelete: React.Dispatch<React.SetStateAction<number | null>>;
  setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedPropertyId: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedImages: React.Dispatch<React.SetStateAction<string[]>>;
  setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>;
  setIsImageModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const InquiryTable: React.FC<InquiryTableProps> = ({
  inquiriesToDisplay,
  setEditingInquiry,
  setIsEditModalOpen,
  setInquiryToDelete,
  setIsDeleteModalOpen,
  setSelectedPropertyId,
  setSelectedImages,
  setCurrentImageIndex,
  setIsImageModalOpen,
}) => {
  return (
    <tbody>
      {inquiriesToDisplay.length > 0 ? (
        inquiriesToDisplay.map((inquiry) => (
          <tr key={inquiry.id}>
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
                {inquiry.id}
              </div>
            </td>
            <td>{inquiry.companyName}</td>
            <td>{inquiry.contactPerson}</td>
            <td>{inquiry.email}</td>
            <td>{inquiry.phone}</td>
            <td>{inquiry.requirements}</td>
            <td>
              {inquiry.budget != null
                ? `Rs. ${inquiry.budget.toLocaleString()}`
                : "N/A"}
            </td>
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
                  onClick={() => {
                    let images: string[] = [];

                    try {
                      if (typeof inquiry.attachments === "string") {
                        const parsed = JSON.parse(inquiry.attachments);
                        images = Array.isArray(parsed) ? parsed : [];
                      } else if (Array.isArray(inquiry.attachments)) {
                        images = inquiry.attachments;
                      }
                    } catch (e) {
                      console.error("Failed to parse attachments:", e);
                      images = [];
                    }

                    setSelectedPropertyId(inquiry.id);
                    setSelectedImages(images);
                    setCurrentImageIndex(0);
                    setIsImageModalOpen(true);
                  }}
                >
                  View
                </button>
              </div>
            </td>
            <td>
              <button
                onClick={() => {
                  setEditingInquiry(inquiry);
                  setIsEditModalOpen(true);
                }}
                className="edit-btn"
                style={{ marginRight: "10px" }}
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setInquiryToDelete(inquiry.id);
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
          <td colSpan={9} className="py-4 text-center">
            No inquiries found
          </td>
        </tr>
      )}
    </tbody>
  );
};

export default InquiryTable;