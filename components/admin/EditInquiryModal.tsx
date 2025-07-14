import React from "react";
import { Inquiry } from "../../types/index";
import { useMessage } from "../../components/MessageBox";

interface EditInquiryModalProps {
  isOpen: boolean;
  editingInquiry: Inquiry | null;
  setEditingInquiry: React.Dispatch<React.SetStateAction<Inquiry | null>>;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setInquiries: React.Dispatch<React.SetStateAction<Inquiry[]>>;
}

const EditInquiryModal: React.FC<EditInquiryModalProps> = ({
  isOpen,
  editingInquiry,
  setEditingInquiry,
  setIsEditModalOpen,
  setInquiries,
}) => {
  const { showMessage } = useMessage();

  if (!isOpen || !editingInquiry) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
        const inquiryToSend = {
        ...editingInquiry,
        attachments: Array.isArray(editingInquiry.attachments)
            ? editingInquiry.attachments
            : JSON.parse(editingInquiry.attachments as unknown as string),
        };

        const res = await fetch("/api/inquiries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiryToSend),
        });

        if (res.ok) {
        const updated = await res.json();
        setInquiries((prev) =>
            prev.map((inq) => (inq.id === updated.id ? updated : inq))
        );
        setIsEditModalOpen(false);
        showMessage("Inquiry updated successfully!");
        } else {
        const err = await res.json();
        showMessage("Update failed: " + err.message);
        }
    } catch (err) {
        console.error(err);
        showMessage("Something went wrong");
    }
    };

  return (
    <div className="modal-container" onClick={() => setIsEditModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-semibold mb-4" style={{ marginBottom: "3%" }}>
          Edit Inquiry
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-row">
              <label htmlFor="companyName" className="font-semibold">
                Company Name
              </label>
              <input
                id="companyName"
                type="text"
                value={editingInquiry.companyName}
                onChange={(e) => setEditingInquiry({ ...editingInquiry, companyName: e.target.value })}
                required
                className="border p-2 rounded"
              />
            </div>

            <div className="form-row">
              <label htmlFor="contactPerson" className="font-semibold">
                Contact Person
              </label>
              <input
                id="contactPerson"
                type="text"
                value={editingInquiry.contactPerson}
                onChange={(e) => setEditingInquiry({ ...editingInquiry, contactPerson: e.target.value })}
                className="border p-2 rounded"
              />
            </div>

            <div className="form-row">
              <label htmlFor="email" className="font-semibold">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={editingInquiry.email}
                onChange={(e) => setEditingInquiry({ ...editingInquiry, email: e.target.value })}
                className="border p-2 rounded"
              />
            </div>

            <div className="form-row">
              <label htmlFor="phone" className="font-semibold">
                Phone
              </label>
              <input
                id="phone"
                type="text"
                value={editingInquiry.phone}
                onChange={(e) => setEditingInquiry({ ...editingInquiry, phone: e.target.value })}
                className="border p-2 rounded"
              />
            </div>

            <div className="form-row">
              <label htmlFor="budget" className="font-semibold">
                Budget
              </label>
              <input
                id="budget"
                type="number"
                value={editingInquiry.budget ?? ""}
                onChange={(e) => setEditingInquiry({ ...editingInquiry, budget: Number(e.target.value) })}
                className="border p-2 rounded"
              />
            </div>
          </div>

          <div className="form-row mt-4">
            <label htmlFor="requirements" className="font-semibold">
              Requirements
            </label>
            <textarea
              id="requirements"
              value={editingInquiry.requirements ?? ""}
              onChange={(e) =>
                setEditingInquiry({ ...editingInquiry, requirements: e.target.value })
              }
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

export default EditInquiryModal;