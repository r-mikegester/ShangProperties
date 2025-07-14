import React, { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { Icon } from "@iconify/react";

const firestore = getFirestore();

const Footer: React.FC = () => {
  const [footer, setFooter] = useState<any>({ address: "", logoUrl: "", socials: [] });

  useEffect(() => {
    const fetchFooter = async () => {
      const docRef = doc(firestore, "config", "footer");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setFooter(docSnap.data());
    };
    fetchFooter();
  }, []);

  return (
    <footer className="w-full bg-white border-t border-[#b08b2e]/20 py-8 flex flex-col items-center gap-4">
      {footer.logoUrl && (
        <img src={footer.logoUrl} alt="Logo" className="h-12 mb-2" />
      )}
      <div className="text-[#b08b2e] font-semibold text-center">{footer.address}</div>
      <div className="flex gap-3 mt-2">
        {(footer.socials || []).map((social: any, idx: number) => (
          <a key={idx} href={social.link} target="_blank" rel="noopener noreferrer" className="text-[#b08b2e] hover:text-[#8a6c1d] text-2xl">
            <Icon icon={social.icon} />
          </a>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
