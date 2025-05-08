import { cn } from "../lib/utils/utils";

interface ProjectCardProps {
    title: string;
    description: string;
    bgImage: string;
    hoverImage: string;
}

export function ProjectCard({
    title,
    description,
    bgImage,
    hoverImage,
}: ProjectCardProps) {
    return (
        <div className="max-w-xs w-full">
            <div
                className={cn(
                    "group w-full cursor-pointer overflow-hidden relative card rounded-3xl h-96 shadow-xl mx-auto flex flex-col justify-end p-4 border border-transparent dark:border-neutral-800",
                    `bg-[url(${bgImage})] bg-cover`,
                    `before:bg-[url(${hoverImage})] before:fixed before:inset-0 before:opacity-0 before:z-[-1]`,
                    `hover:bg-[url(${hoverImage})]`,
                    "hover:after:content-[''] hover:after:absolute hover:after:inset-0 hover:after:bg-black hover:after:opacity-50",
                    "transition-all duration-500"
                )}
            >
                <div className="text relative z-50">
                    <h1 className="font-bold text-xl md:text-2xl text-gray-50">{title}</h1>
                    <p className="text-base text-gray-50 mt-2">{description}</p>
                    <p className="text-base text-gray-50 mt-2">{description}</p>
                    <p className="text-base text-gray-50 mt-2">{description}</p>
                    <p className="text-base text-gray-50 mt-2">{description}</p>
                    <p className="text-base text-gray-50 mt-2">{description}</p>
                </div>
            </div>
        </div>
    );
}
