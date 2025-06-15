import { GridGallery } from '../../components/GridGallery';

const cards = [
    {
        id: 1,
        content: "First image description",
        className: "",
        thumbnail: "https://your-image-url-1.jpg"
    },
    {
        id: 2,
        content: "Second image description",
        className: "",
        thumbnail: "https://your-image-url-2.jpg"
    },
    {
        id: 3,
        content: "Third image description",
        className: "",
        thumbnail: "https://your-image-url-3.jpg"
    }
];

export default function GalleryPage() {
    return <GridGallery cards={ cards } />;
}