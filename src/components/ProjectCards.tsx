"use client";
import React, {
    useEffect,
    useState,
    createContext,
    JSX,
} from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../utils/utils";
import { Icon } from "@iconify/react";

interface CarouselProps {
    items: JSX.Element[];
    initialScroll?: number;
}

type Card = {
    src: string;
    title: string;
    category: string;
    content: React.ReactNode;
    route: string;
};

export const CarouselContext = createContext<{
    onCardClose: (index: number) => void;
    currentIndex: number;
}>({
    onCardClose: () => { },
    currentIndex: 0,
});

export const Carousel = ({ items, initialScroll = 0 }: CarouselProps) => {
    const carouselRef = React.useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = React.useState(false);
    const [canScrollRight, setCanScrollRight] = React.useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (carouselRef.current) {
            carouselRef.current.scrollLeft = initialScroll;
            // Use requestAnimationFrame to ensure the DOM is fully rendered
            requestAnimationFrame(checkScrollability);
        }
    }, [initialScroll]);

    const isMobile = () => {
        return window && window.innerWidth < 768;
    };

    // Calculate current index based on scroll position
    const calculateCurrentIndex = () => {
        if (!carouselRef.current || items.length === 0) return 0;
        
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        const isMobileView = isMobile();
        const cardWidth = isMobileView ? 230 : 384;
        const gap = isMobileView ? 4 : 8;
        const cardWidthWithGap = cardWidth + gap;
        
        // Calculate the maximum scroll position (when last card is fully visible)
        const maxScrollLeft = scrollWidth - clientWidth;
        
        // If we're at the end, return the last index
        if (scrollLeft >= maxScrollLeft - 1) {
            return items.length - 1;
        }
        
        // Otherwise calculate based on scroll position
        return Math.round(scrollLeft / cardWidthWithGap);
    };

    const checkScrollability = () => {
        if (carouselRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
            // More accurate and robust check for scrollability
            const threshold = 2; // Small threshold for precision issues
            
            // Can scroll left if we're not at the beginning
            setCanScrollLeft(scrollLeft > threshold);
            
            // Can scroll right if we're not at the end
            setCanScrollRight(scrollWidth - clientWidth - scrollLeft > threshold);
        }
    };

    const scrollLeft = () => {
        if (carouselRef.current) {
            const cardWidth = isMobile() ? 230 : 384; // (md:w-96)
            const gap = isMobile() ? 4 : 8;
            carouselRef.current.scrollBy({ left: -(cardWidth + gap), behavior: "smooth" });
            
            // Update currentIndex based on new scroll position
            setTimeout(() => {
                setCurrentIndex(calculateCurrentIndex());
                checkScrollability();
            }, 300);
        }
    };

    const scrollRight = () => {
        if (carouselRef.current) {
            const cardWidth = isMobile() ? 230 : 384; // (md:w-96)
            const gap = isMobile() ? 4 : 8;
            carouselRef.current.scrollBy({ left: cardWidth + gap, behavior: "smooth" });
            
            // Update currentIndex based on new scroll position
            setTimeout(() => {
                setCurrentIndex(calculateCurrentIndex());
                checkScrollability();
            }, 300);
        }
    };

    const handleCardClose = (index: number) => {
        if (carouselRef.current) {
            const cardWidth = isMobile() ? 230 : 384; // (md:w-96)
            const gap = isMobile() ? 4 : 8;
            const scrollPosition = (cardWidth + gap) * (index + 1);
            carouselRef.current.scrollTo({
                left: scrollPosition,
                behavior: "smooth",
            });
            setCurrentIndex(index);
        }
    };

    const [hovered, setHovered] = useState<number | null>(null);
    const [sidePadding, setSidePadding] = useState(0);
    const [showTitle, setShowTitle] = useState(true);

    // Check scrollability when items change
    useEffect(() => {
        if (carouselRef.current) {
            // Use a small delay to ensure DOM has updated with new items
            const timer = setTimeout(() => {
                checkScrollability();
                setCurrentIndex(calculateCurrentIndex());
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [items]);

    // Dynamically calculate side padding so first/last card can be centered
    useEffect(() => {
        function updatePadding() {
            if (!carouselRef.current) return;
            const container = carouselRef.current;
            const isMobile = window && window.innerWidth < 768;
            const cardWidth = isMobile ? 224 : 384; // w-56 = 224px, md:w-96 = 384px
            const containerWidth = container.clientWidth;
            const padding = Math.max((containerWidth - cardWidth) / 2, 0);
            setSidePadding(padding);
            
            // Check scrollability and update currentIndex when resizing
            checkScrollability();
            setCurrentIndex(calculateCurrentIndex());
        }
        updatePadding();
        window.addEventListener('resize', updatePadding);
        return () => window.removeEventListener('resize', updatePadding);
    }, []);

    // Handle scroll events to update button states and title visibility
    useEffect(() => {
        const carousel = carouselRef.current;

        if (carousel) {
            const handleScroll = () => {
                checkScrollability();
                setShowTitle(carousel.scrollLeft < 20);
                
                // Update currentIndex based on scroll position
                setCurrentIndex(calculateCurrentIndex());
            };

            carousel.addEventListener('scroll', handleScroll);
            
            // Initial check with a small delay to ensure content is loaded
            const initCheck = setTimeout(() => {
                checkScrollability();
                setShowTitle(carousel.scrollLeft < 20);
                
                // Set initial currentIndex
                setCurrentIndex(calculateCurrentIndex());
            }, 100);

            return () => {
                carousel.removeEventListener('scroll', handleScroll);
                clearTimeout(initCheck);
            };
        }
    }, [items]);

    function getSidePadding() { return sidePadding; }

    return (
        <CarouselContext.Provider
            value={{ onCardClose: handleCardClose, currentIndex }}
        >
            <motion.div
                className="relative w-full h-full bg-[#686058] "
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
            >
                {/* Featured Projects Title in left padding */}
                <motion.div
                    className=""
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: showTitle ? 1 : 0, y: showTitle ? 0 : 30 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 50,
                        height: '100%',
                        width: sidePadding,
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        pointerEvents: 'none',
                        zIndex: 10,
                    }}
                >
                    <span className="text-4xl md:text-7xl font-bold text-white pl-5 md:pl-20 pt-5 castoro-titling-regular select-none">Featured Projects</span>
                </motion.div>
                <div
                    className="flex w-full h-[60vh] md:h-full bg-[#686058]  overflow-x-scroll overscroll-x-auto scroll-smooth py-10 no-scrollbar md:pb-10"
                    ref={carouselRef}
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    <div
                        className={cn(
                            "absolute right-0 z-[99] h-auto w-[5%] overflow-hidden bg-gradient-to-l",
                        )}
                    ></div>

                    <div
                        className={cn(
                            "flex flex-row justify-start gap-4",
                            " max-w-7xl mx-40"
                        )}
                        style={{ paddingLeft: `${getSidePadding()}px`, paddingRight: `${getSidePadding()}px` }}
                    >
                        {items.map((item, index) => (
                            <motion.div
                                key={"card" + index}
                                layout
                                onMouseEnter={() => setHovered(index)}
                                onMouseLeave={() => setHovered(null)}
                                initial={{ filter: "brightness(1)", zIndex: 10 }}
                                animate={
                                    hovered === null
                                        ? { filter: "brightness(1)", zIndex: 10 }
                                        : hovered === index
                                            ? { filter: "brightness(1)", zIndex: 20 }
                                            : { filter: "brightness(0.6)", zIndex: 5 }
                                }
                                transition={{ type: "spring", stiffness: 400, damping: 32, mass: 1.2, duration: 0.3 }}
                                className={cn(
                                    "rounded-3xl cursor-pointer transition-transform duration-150"
                                )}
                            >
                                {item}
                            </motion.div>
                        ))}
                    </div>
                </div>
                {/* Dot Indicator */}
                <div className="w-full flex justify-center items-center mt-2 absolute left-0 right-0 bottom-1 z-50">
                    {items.map((_, idx) => (
                        <button
                            key={idx}
                            className={`mx-1 w-3 h-3 rounded-full border-2 border-white transition-all duration-200 focus:outline-none ${currentIndex === idx ? 'bg-[#b08b2e] scale-125' : 'bg-transparent'}`}
                            aria-label={`Go to project ${idx + 1}`}
                            onClick={() => {
                                if (carouselRef.current) {
                                    const cardWidth = window.innerWidth < 768 ? 224 : 384;
                                    const gap = window.innerWidth < 768 ? 4 : 8;
                                    const scrollPosition = idx * (cardWidth + gap);
                                    carouselRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
                                    setCurrentIndex(idx);
                                }
                            }}
                        />
                    ))}
                </div>
                {/* Centered Side Arrows */}
                <button
                    className="absolute left-5 top-1/2 z-[100] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md disabled:opacity-50"
                    onClick={scrollLeft}
                    disabled={!canScrollLeft}
                    aria-label="Scroll left"
                >
                    <Icon icon="solar:alt-arrow-left-broken" className="size-10 text-[#B08B2E]" />
                </button>
                <button
                    className="absolute right-5 top-1/2 z-[100] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md disabled:opacity-50"
                    onClick={scrollRight}
                    disabled={!canScrollRight}
                    aria-label="Scroll right"
                >
                    <Icon icon="solar:alt-arrow-right-broken" className="size-10 text-[#B08B2E]" />
                </button>
            </motion.div>
        </CarouselContext.Provider>
    );
};

export const Card = ({
    card,
    index,
    layout = false,
}: {
    card: Card;
    index: number;
    layout?: boolean;
}) => {
    const [showButton, setShowButton] = useState(false);
    // Hide button when clicking outside
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (!(e.target as HTMLElement).closest(`#apple-card-${index}`)) {
                setShowButton(false);
            }
        };
        window.addEventListener("mousedown", handleClick);
        return () => window.removeEventListener("mousedown", handleClick);
    }, [index]);
    return (
        <motion.div
            id={`apple-card-${index}`}
            layoutId={layout ? `card-${card.title}` : undefined}
            className={
                `relative z-50 flex h-80 w-56 flex-col justify-start overflow-hidden rounded-3xl bg-gray-100 md:h-full md:w-96 dark:bg-neutral-900 transition-transform duration-150 hover:scale-105 hover:shadow-md Westmount ` +
                (showButton ? 'border-4 border-[#b08b2e]' : '')
            }
            onClick={() => setShowButton(true)}
        >
            {/* Overlay Gradient: Vignette from bottom to transparent for contrast */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-full bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            {/* Card Image */}
            <BlurImage
                src={card.src}
                alt={card.title}
                className="absolute inset-0 z-10 object-cover"
            />
            {/* Card Title and Category at the Bottom */}
            <div className="relative z-40 w-full px-6 pb-6 pt-2 mt-auto">
                <motion.p
                    layoutId={layout ? `category-${card.category}` : undefined}
                    className="text-left text-xs font-medium text-[#b08b2e] md:text-sm Westmount"
                >
                    {card.category}
                </motion.p>
                <motion.p
                    layoutId={layout ? `title-${card.title}` : undefined}
                    className="max-w-xs w-56 md:w-72 text-left text-xl font-bold westmount md:text-2xl"
                >
                    {card.title}
                </motion.p>
            </div>
            {/* Visit Button at the bottom, only when clicked */}
            <AnimatePresence>
                {showButton && (
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 24 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.3 }}
                        className="absolute bottom-20 left-0 w-full flex justify-center z-50 px-3"
                    >
                        <Link
                            className="px-6 py-2 rounded-2xl bg-white active:scale-90 text-gray-900 font-semibold shadow-lg hover:bg-[#b08b2e] hover:text-white transition-colors duration-150 westmount"
                            to={card.route}
                            onClick={e => e.stopPropagation()}
                        >
                            View Details
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export const BlurImage = ({
    height,
    width,
    src,
    className,
    alt,
    ...rest
}: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const [isLoading, setLoading] = useState(true);
    return (
        <img
            className={cn(
                "h-full w-full transition skeleton duration-300",
                isLoading ? "blur-sm" : "blur-0",
                className,
            )}
            onLoad={() => setLoading(false)}
            src={src as string}
            width={width}
            height={height}
            loading="lazy"
            decoding="async"
            alt={alt ? alt : "Background of a beautiful view"}
            {...rest}
        />
    );
};