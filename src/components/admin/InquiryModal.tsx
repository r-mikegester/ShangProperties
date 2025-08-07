import React from "react";

interface InquiryModalProps {
  inquiry: any;
  open: boolean;
  onClose: () => void;
}

const InquiryModal: React.FC<InquiryModalProps> = ({ inquiry, open, onClose }) => {
  if (!open || !inquiry) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-slate-400 hover:text-slate-700 text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-lg font-bold mb-4 text-[#b08b2e]">Inquiry Details</h2>
        <div className="mb-2">
          <span className="font-semibold">Name:</span> {inquiry.firstName} {inquiry.lastName}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Email:</span> {inquiry.email}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Phone:</span> {inquiry.phone}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Country:</span> {inquiry.country}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Message:</span> {inquiry.message}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Date:</span> {inquiry.createdAt && inquiry.createdAt.toDate ? inquiry.createdAt.toDate().toLocaleString() : ""}
        </div>
      </div>
    </div>
  );
};

export default InquiryModal;
