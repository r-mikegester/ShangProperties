import React, {
    useState,
    Children,
    useRef,
    useLayoutEffect,
    HTMLAttributes,
    ReactNode,
    isValidElement,
    forwardRef,
    useImperativeHandle
} from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface StepperRenderProps {
    currentStep: number;
    totalSteps: number;
    isLastStep: boolean;
    isCompleted: boolean;
    next: () => void;
    back: () => void;
    complete: () => void;
    goTo: (step: number) => void;
}

export interface StepperRef {
    next: () => void;
    back: () => void;
    complete: () => void;
    goTo: (step: number) => void;
    getCurrentStep: () => number;
}

interface StepperProps {
    children: React.ReactNode | ((props: StepperRenderProps) => React.ReactNode);
    initialStep?: number;
    onStepChange?: (step: number) => void;
    onFinalStepCompleted?: () => void;
    stepCircleContainerClassName?: string;
    stepContainerClassName?: string;
    contentClassName?: string;
    footerClassName?: string;
    backButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    nextButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    backButtonText?: string;
    nextButtonText?: string;
    disableStepIndicators?: boolean;
    renderStepIndicator?: (props: {
        step: number;
        currentStep: number;
        onStepClick: (clicked: number) => void;
    }) => React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

const Stepper = forwardRef<StepperRef, StepperProps>(function Stepper({
    children,
    initialStep = 1,
    onStepChange = () => { },
    onFinalStepCompleted = () => { },
    stepCircleContainerClassName = "",
    stepContainerClassName = "",
    contentClassName = "",
    footerClassName = "",
    backButtonProps = {},
    nextButtonProps = {},
    backButtonText = "Back",
    nextButtonText = "Continue",
    disableStepIndicators = false,
    renderStepIndicator,
    ...rest
}, ref) {
    const [currentStep, setCurrentStep] = useState<number>(initialStep);
    const [direction, setDirection] = useState<number>(0);
    const stepsArray = Children.toArray(
        typeof children === "function" ? [] : children
    );
    const totalSteps = stepsArray.length;
    const isCompleted = currentStep > totalSteps;
    const isLastStep = currentStep === totalSteps;

    const updateStep = (newStep: number) => {
        setCurrentStep(newStep);
        if (newStep > totalSteps) {
            onFinalStepCompleted();
        } else {
            onStepChange(newStep);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setDirection(-1);
            updateStep(currentStep - 1);
        }
    };

    const handleNext = () => {
        if (!isLastStep) {
            setDirection(1);
            updateStep(currentStep + 1);
        }
    };

    const handleComplete = () => {
        setDirection(1);
        updateStep(totalSteps + 1);
    };

    const goTo = (step: number) => {
        if (step >= 1 && step <= totalSteps) {
            setDirection(step > currentStep ? 1 : -1);
            updateStep(step);
        }
    };

    useImperativeHandle(ref, () => ({
        next: handleNext,
        back: handleBack,
        complete: handleComplete,
        goTo,
        getCurrentStep: () => currentStep,
    }), [currentStep]);

    // Render prop pattern
    if (typeof children === "function") {
        return (
            <div
                className="flex min-h-full flex-1 flex-col items-center justify-center p-4 sm:aspect-[4/3] md:aspect-[2/1]"
                {...rest}
            >
                {children({
                    currentStep,
                    totalSteps,
                    isLastStep,
                    isCompleted,
                    next: handleNext,
                    back: handleBack,
                    complete: handleComplete,
                    goTo,
                })}
            </div>
        );
    }

    // Default rendering (backward compatible)
    return (
        <div
            className="flex min-h-full flex-1 flex-col items-center justify-center p-4 sm:aspect-[4/3] md:aspect-[2/1]"
            {...rest}
        >
            <div
                className={`mx-auto w-full max-w-md bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl ${stepCircleContainerClassName}`}
            >
                <div
                    className={`${stepContainerClassName} flex w-full items-center pt-8 px-8`}
                >
                    {stepsArray.map((_, index) => {
                        const stepNumber = index + 1;
                        const isNotLastStep = index < totalSteps - 1;
                        return (
                            <React.Fragment key={stepNumber}>
                                {renderStepIndicator ? (
                                    renderStepIndicator({
                                        step: stepNumber,
                                        currentStep,
                                        onStepClick: (clicked) => {
                                            setDirection(clicked > currentStep ? 1 : -1);
                                            updateStep(clicked);
                                        },
                                    })
                                ) : (
                                    <StepIndicator
                                        step={stepNumber}
                                        disableStepIndicators={disableStepIndicators}
                                        currentStep={currentStep}
                                        onClickStep={(clicked) => {
                                            setDirection(clicked > currentStep ? 1 : -1);
                                            updateStep(clicked);
                                        }}
                                    />
                                )}
                                {isNotLastStep && (
                                    <StepConnector isComplete={currentStep > stepNumber} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                <StepContentWrapper
                    isCompleted={isCompleted}
                    currentStep={currentStep}
                    direction={direction}
                    className={`space-y-2 px-8 ${contentClassName}`}
                >
                    {stepsArray[currentStep - 1]}
                </StepContentWrapper>
            </div>
        </div>
    );
});

export default Stepper;

interface StepContentWrapperProps {
    isCompleted: boolean;
    currentStep: number;
    direction: number;
    children: ReactNode;
    className?: string;
}

function StepContentWrapper({
    isCompleted,
    currentStep,
    direction,
    children,
    className = "",
}: StepContentWrapperProps) {
    const [parentHeight, setParentHeight] = useState<number>(0);

    return (
        <motion.div
            style={{ position: "relative", overflow: "hidden" }}
            animate={{ height: isCompleted ? 0 : parentHeight }}
            transition={{ type: "spring", duration: 0.4 }}
            className={className}
        >
            <AnimatePresence initial={false} mode="sync" custom={direction}>
                {!isCompleted && (
                    <SlideTransition
                        key={currentStep}
                        direction={direction}
                        onHeightReady={(h) => setParentHeight(h)}
                    >
                        {children}
                    </SlideTransition>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

interface SlideTransitionProps {
    children: ReactNode;
    direction: number;
    onHeightReady: (height: number) => void;
}

function SlideTransition({
    children,
    direction,
    onHeightReady,
}: SlideTransitionProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
        if (containerRef.current) {
            onHeightReady(containerRef.current.offsetHeight);
        }
    }, [children, onHeightReady]);

    return (
        <motion.div
            ref={containerRef}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4 }}
            style={{ position: "absolute", left: 0, right: 0, top: 0 }}
        >
            {children}
        </motion.div>
    );
}

const stepVariants: Variants = {
    enter: (dir: number) => ({
        x: dir >= 0 ? "-100%" : "100%",
        opacity: 0,
    }),
    center: {
        x: "0%",
        opacity: 1,
    },
    exit: (dir: number) => ({
        x: dir >= 0 ? "50%" : "-50%",
        opacity: 0,
    }),
};

interface StepProps {
    children: ReactNode;
}

export function Step({ children }: StepProps) {
    return <div className="p-8">{children}</div>;
}

interface StepIndicatorProps {
    step: number;
    currentStep: number;
    onClickStep: (clicked: number) => void;
    disableStepIndicators?: boolean;
}

function StepIndicator({
    step,
    currentStep,
    onClickStep,
    disableStepIndicators = false,
}: StepIndicatorProps) {
    const status =
        currentStep === step
            ? "active"
            : currentStep < step
                ? "inactive"
                : "complete";

    const handleClick = () => {
        if (step !== currentStep && !disableStepIndicators) {
            onClickStep(step);
        }
    };

    return (
        <motion.div
            onClick={handleClick}
            className="relative cursor-pointer outline-none focus:outline-none"
            animate={status}
            initial={false}
        >
            <motion.div
                variants={{
                    inactive: { scale: 1, backgroundColor: "#f3f4f6", color: "#a3a3a3", boxShadow: "0 2px 8px 0 #e5e7eb" },
                    active: { scale: 1.1, backgroundColor: "#b08b2e", color: "#fff", boxShadow: "0 4px 16px 0 #b08b2e33" },
                    complete: { scale: 1, backgroundColor: "#b08b2e", color: "#fff", boxShadow: "0 2px 8px 0 #b08b2e22" },
                }}
                transition={{ duration: 0.3 }}
                className="flex h-12 w-12 items-center justify-center rounded-full font-semibold castoro-titling-regular text-lg shadow-md border-4 border-white"
            >
                {status === "complete" ? (
                    <CheckIcon className="h-6 w-6 text-white" />
                ) : (
                    <span className="text-lg">{step}</span>
                )}
            </motion.div>
        </motion.div>
    );
}

interface StepConnectorProps {
    isComplete: boolean;
}

function StepConnector({ isComplete }: StepConnectorProps) {
    const lineVariants: Variants = {
        incomplete: { width: 0, backgroundColor: "#e5e7eb" },
        complete: { width: "100%", backgroundColor: "#b08b2e" },
    };

    return (
        <div className="relative mx-2 h-1 flex-1 overflow-hidden rounded-full bg-[#e5e7eb]">
            <motion.div
                className="absolute left-0 top-0 h-full rounded-full"
                variants={lineVariants}
                initial={false}
                animate={isComplete ? "complete" : "incomplete"}
                transition={{ duration: 0.4 }}
            />
        </div>
    );
}

interface CheckIconProps extends React.SVGProps<SVGSVGElement> { }

function CheckIcon(props: CheckIconProps) {
    return (
        <svg
            {...props}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
        >
            <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                    delay: 0.1,
                    type: "tween",
                    ease: "easeOut",
                    duration: 0.3,
                }}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
            />
        </svg>
    );
}
