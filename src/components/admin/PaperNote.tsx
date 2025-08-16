import React from 'react';

interface PaperNoteProps {
  children: React.ReactNode;
  className?: string;
}

const PaperNote: React.FC<PaperNoteProps> = ({ children, className = '' }) => {
  return (
    <div className={`rounded-2xl relative bg-[#b08b2e]/30 shadow-[0px_0px_5px_0px_rgba(0,0,0,0.5)] ${className}`}>
      {/* Holes */}
      <div className="absolute left-2.5 top-[10%] h-6 w-6 bg-white rounded-full shadow-[inset_0px_0px_2px_0px_rgba(0,0,0,0.5)]"></div>
      <div className="absolute left-2.5 top-1/2 h-6 w-6 bg-white rounded-full shadow-[inset_0px_0px_2px_0px_rgba(0,0,0,0.5)] -translate-y-1/2"></div>
      <div className="absolute left-2.5 bottom-[10%] h-6 w-6 bg-white rounded-full shadow-[inset_0px_0px_2px_0px_rgba(0,0,0,0.5)]"></div>
      
      {/* Lines and content */}
      <div className="ml-12 h-full w-[calc(100%-3rem)]">
        {/* Red line */}
        <div className="absolute left-11 top-0 h-full w-0.5 bg-[#b08b2e]"></div>
        
        {/* Lines background and content */}
        <div 
          className="py-5 h-[calc(100%)]  w-full">
          <div 
            className="absolute left-14 top-10 bottom-2.5 right-2.5 overflow-hidden outline-none"
            style={{ fontFamily: "'Indie Flower'", lineHeight: '25px' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaperNote;