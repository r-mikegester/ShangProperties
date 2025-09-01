import React, { Dispatch, ReactNode, SetStateAction, useState, useCallback, useMemo } from "react";
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
    drawerHeight?: string; // Height of the drawer when open
}

const DragCloseDrawer = ({
    open,
    setOpen,
    children,
    drawerHeight = "80vh",
    onClose,
}: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    children: ReactNode;
    drawerHeight?: string;
    onClose?: () => void;
}) => {
    const [scope, animate] = useAnimate();
    const [drawerRef, { height }] = useMeasure();
    const [percent, setPercent] = useState(0);
    const [dragging, setDragging] = useState(false);
    const [dragPercent, setDragPercent] = useState<number | null>(null);
    const startYRef = React.useRef<number | null>(null);
    const startPercentRef = React.useRef<number>(0);
    const percentMotion = useMotionValue(0);
    const snapPoints = useMemo(() => [25, 50, 75, 100], []);

    // Memoize calculations to prevent unnecessary re-renders
    const calculatePercentFromHeight = useCallback(() => {
        if (typeof drawerHeight === "string" && drawerHeight.endsWith("vh")) {
            const vhPercent = parseFloat(drawerHeight);
            return isNaN(vhPercent) ? 80 : vhPercent;
        }

        if (typeof drawerHeight === "string" && drawerHeight.endsWith("px")) {
            const pxHeight = parseFloat(drawerHeight);
            if (!isNaN(pxHeight) && pxHeight > 0) {
                return Math.min(100, Math.round((pxHeight / window.innerHeight) * 100));
            }
        }

        return 80;
    }, [drawerHeight]);

    React.useEffect(() => {
        setPercent(calculatePercentFromHeight());
    }, [calculatePercentFromHeight]);

    // Unified drag/resize handle logic with optimized event handling
    const handleResizeStart = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
        setDragging(true);
        startYRef.current = e.clientY;
        startPercentRef.current = percent;
        setDragPercent(percent);
        document.body.style.userSelect = 'none';
    }, [percent]);

    const handleResizeMove = useCallback((e: PointerEvent) => {
        if (!dragging || startYRef.current === null) return;
        const deltaY = startYRef.current - e.clientY;
        const vh = window.innerHeight;
        let newPercent = startPercentRef.current + (deltaY / vh) * 100;
        newPercent = Math.max(25, Math.min(100, newPercent));
        setDragPercent(newPercent);
        percentMotion.set(newPercent);
    }, [dragging, percentMotion]);

    const handleResizeEnd = useCallback(() => {
        if (dragPercent !== null) {
            // Snap to nearest snapPoint
            let closest = snapPoints.reduce((prev, curr) => 
                Math.abs(curr - dragPercent) < Math.abs(prev - dragPercent) ? curr : prev
            );
            
            // If dragged down enough, close the drawer
            if (dragPercent < 20) {
                setOpen(false);
                if (onClose) onClose();
            } else {
                setPercent(closest);
                percentMotion.stop();
                percentMotion.set(closest);
                setTimeout(() => setDragPercent(null), 150); // allow animation to finish
            }
        }
        setDragging(false);
        document.body.style.userSelect = '';
    }, [dragPercent, snapPoints, setOpen, onClose, percentMotion]);

    React.useEffect(() => {
        if (!dragging) return;
        const move = (e: PointerEvent) => handleResizeMove(e);
        const up = () => handleResizeEnd();
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
        return () => {
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerup', up);
        };
    }, [dragging, handleResizeMove, handleResizeEnd]);

    // Animate percentMotion to percent when not dragging
    React.useEffect(() => {
        if (!dragging) {
            percentMotion.stop();
            percentMotion.set(percent);
        }
    }, [percent, dragging, percentMotion]);

    // Drag-to-close logic
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
        if (y.get() >= 100) {
            handleClose();
        }
    };

    // Prevent background scroll when open
    React.useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    return (
        <>
            {open && (
                <motion.div
                    ref={scope}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={handleClose}
                    className="fixed inset-0 z-[3001] bg-black/40"
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
                        style={{ 
                            y, 
                            height: drawerHeight,
                            transition: dragging ? 'none' : 'height 0.25s cubic-bezier(0.4,0,0.2,1)' 
                        }}
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
                        <div className="sticky top-0 z-20 bg-white p-1 flex items-center justify-between min-h-[28px]">
                            <div className="flex-1 flex items-center justify-center relative">
                                <button
                                    onPointerDown={(e) => {
                                        controls.start(e);
                                        handleResizeStart(e);
                                    }}
                                    className="h-5 w-full cursor-ns-resize touch-none rounded-3xl rounded-b-none duration-150 select-none active:cursor-grabbing flex items-center justify-center"
                                    aria-label="Drag to resize or close"
                                    style={{ transition: 'background 0.2s' }}
                                >
                                    <a onPointerDown={(e) => {
                                        controls.start(e);
                                        
                                    }}
                                    className="h-1.5 w-16 cursor-ns-resize touch-none rounded-full active:bg-[#b08b2e] active:w-20 duration-150 select-none bg-gray-400 active:cursor-grabbing hover:bg-gray-500"
                                    aria-label="Drag to resize or close"
                                    style={{ transition: 'background 0.2s' }}></a>
                                </button>
                            </div>
                            {/* {onClose && !disableClose && (
                                <button
                                    className="text-red-400 hover:text-gray-700 text-2xl font-bold focus:outline-none ml-2"
                                    onClick={handleClose}
                                    aria-label="Close"
                                    style={{ zIndex: 4000 }}
                                >
                                    ×
                                </button>
                            )} */}
                        </div>
                        <div className="relative z-0 h-full overflow-y-scroll">
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </>
    );
};
