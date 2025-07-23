import { Icon } from "@iconify/react";
import React, { useState, useEffect } from "react";
import { DragCloseDrawer } from "./DragCloseDrawer";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);
  return isMobile;
}

const NotFound: React.FC = () => {
  const isMobile = useIsMobile();

  const Card = (
    <div className="w-full lg:w-1/2 bg-white md:bg-[#b08b2e] md:rounded-t-none  rounded-t-3xl h-96 md:h-full p-3 md:p-6">
      <p className="text-sm font-medium text-white pl-5">404 error</p>
      <h1 className="text-5xl font-bold  md:text-9xl">OOOPS!</h1>
      <p className="mt-4 ">Sorry, the page you are looking for wasn't found or doesn't exist. Here are some helpful links:</p>
      <div className="flex items-center flex-row-revese md:flex-row mt-6 gap-x-3">
        <button
          className="flex items-center justify-center w-1/2 px-3 py-2 text-sm btn bg-[#b08b2e]  transition-colors duration-200 border-0 shadow-none rounded-lg gap-x-2 sm:w-auto hover:bg-gray-100 hover:text-[#362b0e] text-white"
          onClick={() => window.history.back()}
        >
          <Icon icon="solar:alt-arrow-left-broken" width="24" height="24" />
          <span>Go back</span>
        </button>
        <button
          className="w-1/2 px-5 py-2 text-sm tracking-wide btn border-0 transition-colors duration-200 hover:shadow-inner hover:border hover:border-gray-900/50 hover:bg-[#b08b2e] bg-white text-[#362b0e] rounded-lg shrink-0 sm:w-auto "
          onClick={() => window.location.href = "/"}
        >
          Take me home
        </button>
      </div>
    </div>
  );

  return (
    <section className="bg-[#b08b2e] overflow-hidden h-screen">
      <div className="container min-h-screen pt-12 mx-auto flex flex-col-reverse md:flex md:flex-row lg:items-center lg:gap-12">
        {isMobile ? (
          <>
            <div className="w-full flex z-50 justify-center mb-4 mt-4">
              <Icon icon="tabler:face-id-error" width="96" height="96" className="text-white" />
            </div>
            <DragCloseDrawer open={true} setOpen={() => {}} disableClose={true} drawerHeight="50vh">
              {Card}
            </DragCloseDrawer>
          </>
        ) : (
          <>
            {Card}
            <div className="relative w-full flex justify-center mt-12 lg:w-1/2 lg:mt-0">
              <Icon icon="tabler:face-id-error" width="24" height="24" className="size-96 text-white" />
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default NotFound;
