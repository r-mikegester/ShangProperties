import React, { Dispatch, ReactNode, SetStateAction, useState } from "react";
import useMeasure from "react-use-measure";
import {
    useDragControls,
    useMotionValue,
    useAnimate,
    motion,
} from "framer-motion";

export const DragCloseDrawerExample = () => {
    const [open, setOpen] = useState(false);
    return (
        <div className="grid h-screen place-content-center bg-neutral-950">
            <button
                onClick={() => setOpen(true)}
                className="rounded bg-indigo-500 px-4 py-2 text-white transition-colors hover:bg-indigo-600"
            >
                Open drawer
            </button>

            <DragCloseDrawer open={open} setOpen={setOpen}>
                <div className="mx-auto max-w-2xl space-y-4 text-neutral-400">
                    <h2 className="text-4xl font-bold text-neutral-200">
                        Drag the handle at the top of this modal downwards 100px to close it
                    </h2>
                    {/* ...content omitted for brevity... */}
                </div>
            </DragCloseDrawer>
        </div>
    );
};

export { DragCloseDrawer };

interface Props {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    children?: ReactNode;
    onClose?: () => void;
    disableClose?: boolean;
    drawerHeight?: string; // Add this line
}

const DragCloseDrawer = ({ open, setOpen, children, onClose, disableClose = false, drawerHeight = '75vh' }: Props) => {
    const [scope, animate] = useAnimate();
    const [drawerRef, { height }] = useMeasure();

    const y = useMotionValue(0);
    const controls = useDragControls();

    const handleClose = async () => {
        animate(scope.current, {
            opacity: [1, 0],
        });

        const yStart = typeof y.get() === "number" ? y.get() : 0;

        await animate("#drawer", {
            y: [yStart, height],
        });

        setOpen(false);
    };

    const handleDragEnd = async () => {
        if (disableClose) {
            // Animate back to open position
            await animate("#drawer", { y: 0 });
        } else {
            if (y.get() >= 100) {
                handleClose();
            }
        }
    };

    return (
        <>
            {open && (
                <motion.div
                    ref={scope}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={disableClose ? undefined : handleClose}
                    className="fixed inset-0 z-[2999] bg-black/40"
                >
                    <motion.div
                        id="drawer"
                        ref={drawerRef}
                        onClick={(e) => e.stopPropagation()}
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        transition={{
                            ease: "easeInOut",
                        }}
                        className={`absolute bottom-0 w-full overflow-hidden rounded-t-3xl bg-white shadow-2xl`}
                        style={{ y, height: drawerHeight }}
                        drag="y"
                        dragControls={controls}
                        onDragEnd={handleDragEnd}
                        dragListener={false}
                        dragConstraints={{
                            top: 0,
                            bottom: 0,
                        }}
                        dragElastic={{
                            top: 0,
                            bottom: 0.5,
                        }}
                    >
                        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 p-4 flex items-center justify-center min-h-[48px]">
                            <button
                                onPointerDown={(e) => {
                                    controls.start(e);
                                }}
                                className="h-2 w-12 cursor-grab touch-none rounded-full bg-gray-300 active:cursor-grabbing absolute left-1/2 -translate-x-1/2"
                                aria-label="Drag to close"
                            ></button>
                            {onClose && !disableClose && (
                                <button
                                    className="text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none absolute right-4"
                                    onClick={handleClose}
                                    aria-label="Close"
                                    style={{ zIndex: 120 }}
                                >
                                    ×
                                </button>
                            )}
                        </div>
                        <div className="relative z-0 h-full overflow-y-scroll py-4 pt-2">
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </>
    );
};
