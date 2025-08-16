import React from "react";
import HeroEditor from "../../components/admin/HeroEditor";
import ContactEditor from "../../components/admin/ContactEditor";
import FooterEditor from "../../components/admin/FooterEditor";

const PageManagement: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-[#b08b2e] mb-6">Homepage Management</h1>
      {/* Hero Section Editor */}
      <section className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#b08b2e]">Hero Section</h2>
        <HeroEditor />
      </section>
      {/* Contact Section Editor */}
      <section className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#b08b2e]">Contact Section</h2>
        <ContactEditor />
      </section>
      {/* Footer Section Editor */}
      <section className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#b08b2e]">Footer Section</h2>
        <FooterEditor />
      </section>
    </div>
  );
};

export default PageManagement;
