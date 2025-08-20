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
    drawerHeight?: string; // Height of the drawer when open
}

const DragCloseDrawer = ({ open, setOpen, children, onClose, disableClose = false, drawerHeight = '90vh' }: Props) => {
    const [scope, animate] = useAnimate();
    const [drawerRef, { height }] = useMeasure();

    // Resizable logic (smooth drag, snap on release)
    const [percent, setPercent] = useState(90); // Default to 90%
    const snapPoints = [25, 50, 75, 90];
    const [dragging, setDragging] = useState(false);
    const startYRef = React.useRef<number | null>(null);
    const startPercentRef = React.useRef<number>(percent);
    const [dragPercent, setDragPercent] = useState<number | null>(null);
    const percentMotion = useMotionValue(percent);

    // Calculate percent based on drawerHeight
    const calculatePercentFromHeight = React.useCallback(() => {
        const heightValue = parseInt(drawerHeight);
        if (!isNaN(heightValue)) {
            return Math.min(100, Math.max(25, heightValue));
        }
        return 90;
    }, [drawerHeight]);

    React.useEffect(() => {
        setPercent(calculatePercentFromHeight());
    }, [drawerHeight, calculatePercentFromHeight]);

    // Unified drag/resize handle logic
    const handleResizeStart = (e: React.PointerEvent<HTMLButtonElement>) => {
        setDragging(true);
        startYRef.current = e.clientY;
        startPercentRef.current = percent;
        setDragPercent(percent);
        document.body.style.userSelect = 'none';
    };
    const handleResizeMove = (e: PointerEvent) => {
        if (!dragging || startYRef.current === null) return;
        const deltaY = startYRef.current - e.clientY;
        const vh = window.innerHeight;
        let newPercent = startPercentRef.current + (deltaY / vh) * 100;
        newPercent = Math.max(25, Math.min(100, newPercent));
        setDragPercent(newPercent);
        percentMotion.set(newPercent);
    };
    const handleResizeEnd = () => {
        if (dragPercent !== null) {
            // Snap to nearest snapPoint
            let closest = snapPoints.reduce((prev, curr) => Math.abs(curr - dragPercent) < Math.abs(prev - dragPercent) ? curr : prev);
            setPercent(closest);
            percentMotion.stop();
            percentMotion.set(closest);
            setTimeout(() => setDragPercent(null), 150); // allow animation to finish
        }
        setDragging(false);
        document.body.style.userSelect = '';
    };
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
    }, [dragging, dragPercent]);

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
        if (disableClose) {
            // Animate back to open position
            await animate("#drawer", { y: 0 });
        } else {
            if (y.get() >= 100) {
                handleClose();
            }
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
                    onClick={disableClose ? undefined : handleClose}
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
                        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 p-1 flex items-center justify-between min-h-[48px]">
                            <div className="flex-1 flex items-center justify-center relative">
                                <button
                                    onPointerDown={(e) => {
                                        controls.start(e);
                                        handleResizeStart(e);
                                    }}
                                    className="h-9 w-full cursor-ns-resize touch-none rounded-3xl rounded-b-none  duration-150 select-none active:cursor-grabbing"
                                    aria-label="Drag to resize or close"
                                    style={{ transition: 'background 0.2s' }}
                                >
                                    <a onPointerDown={(e) => {
                                        controls.start(e);
                                        
                                    }}
                                    className="h-3 w-16 cursor-ns-resize touch-none rounded-full active:bg-[#b08b2e] active:w-20 duration-150 select-none bg-gray-300 active:cursor-grabbing"
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
