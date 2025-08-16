import React from "react";
import PaperNote from "./PaperNote";

interface InquiryModalProps {
  inquiry: any;
  open: boolean;
  onClose: () => void;
}

const InquiryModal: React.FC<InquiryModalProps> = ({ inquiry, open, onClose }) => {
  if (!open || !inquiry) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="w-full max-w-md relative">
        <button
          className="absolute -top-8 right-0 text-slate-100 hover:text-slate-300 text-2xl z-10"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        
        <PaperNote className="h-[550px] w-[450px] max-w-full max-h-full">
          <div className="p-6 h-full">
            <h2 className="text-xl font-bold mb-4 text-[#b08b2e]">Inquiry Details</h2>
            <div className="mb-2"><span className="font-semibold">Name:</span> {inquiry.firstName} {inquiry.lastName}</div>
            <div className="mb-2"><span className="font-semibold">Email:</span> {inquiry.email}</div>
            <div className="mb-2"><span className="font-semibold">Phone:</span> {inquiry.phone}</div>
            <div className="mb-2"><span className="font-semibold">Country:</span> {inquiry.country}</div>
            <div className="mb-2"><span className="font-semibold">Property:</span> {inquiry.property}</div>
            <div className="mb-2"><span className="font-semibold">Message:</span> {inquiry.message}</div>
            <div className="mb-2"><span className="font-semibold">Date:</span> {inquiry.createdAt && inquiry.createdAt.toDate ? inquiry.createdAt.toDate().toLocaleString() : ""}</div>
          </div>
        </PaperNote>
      </div>
    </div>
  );
};

export default InquiryModal;