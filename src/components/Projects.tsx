import { useState } from "react";

export default function Projects() {
    const [likes, setLikes] = useState(875);
    const [comments, setComments] = useState(16);
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <div className="max-w-[85rem] h-full px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="grid lg:grid-cols-3 gap-y-8 lg:gap-y-0 lg:gap-x-6">
                {/* Content */}
                <div className="lg:col-span-2">
                    <div className="py-8 lg:pe-8">
                        {/* Blog header */}
                        <a href="#" className="inline-flex items-center gap-x-1.5 text-sm text-gray-600 hover:underline">
                            <svg className="shrink-0 size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                            Back to Blog
                        </a>

                        <h2 className="text-3xl font-bold lg:text-5xl my-4">Announcing a free plan for small teams</h2>

                        <div className="flex items-center gap-x-5 mb-6">
                            <a className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-sm bg-gray-100 text-gray-800 hover:bg-gray-200" href="#">
                                Company News
                            </a>
                            <p className="text-sm text-gray-800">January 18, 2023</p>
                        </div>

                        {/* Body text */}
                        <p className="text-lg text-gray-800 mb-4">
                            At Preline, our mission has always been focused on bringing openness and transparency to the design process...
                        </p>

                        {/* Final Buttons */}
                        <div className="flex items-center justify-between mt-10">
                            <div className="flex gap-x-2">
                                <button onClick={() => setLikes((prev) => prev + 1)} className="flex items-center gap-x-2 text-sm text-gray-500 hover:text-gray-800">
                                    <svg className="shrink-0 size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                                    </svg>
                                    {likes}
                                </button>

                                <button onClick={() => setComments((prev) => prev + 1)} className="flex items-center gap-x-2 text-sm text-gray-500 hover:text-gray-800">
                                    <svg className="shrink-0 size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
                                    </svg>
                                    {comments}
                                </button>
                            </div>

                            {/* Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center gap-x-2 text-sm text-gray-500 hover:text-gray-800"
                                >
                                    <svg className="shrink-0 size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                                        <polyline points="16 6 12 2 8 6" />
                                        <line x1="12" x2="12" y1="2" y2="15" />
                                    </svg>
                                    Share
                                </button>

                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-56 z-20 bg-gray-900 text-white rounded-lg shadow-lg p-2">
                                        <button className="w-full text-left px-3 py-2 text-sm hover:bg-white/10 rounded">Copy Link</button>
                                        <hr className="my-1 border-gray-700" />
                                        <button className="w-full text-left px-3 py-2 text-sm hover:bg-white/10 rounded">Facebook</button>
                                        <button className="w-full text-left px-3 py-2 text-sm hover:bg-white/10 rounded">Twitter</button>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* End of footer */}
                    </div>
                </div>
            </div>
        </div>
    );
}
