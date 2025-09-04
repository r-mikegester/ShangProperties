const admin = require("firebase-admin");
const serviceAccount = require("../backend/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const BLOB_BASE_URL =
  "https://frfgvl8jojjhk5cp.public.blob.vercel-storage.com/";

async function updateProjectImages() {
  const snapshot = await db.collection("projects").get();
  for (const doc of snapshot.docs) {
    const data = doc.data();
    let updated = false;

    // Example: update 'image' field
    if (data.image && typeof data.image === "string") {
      const filename = data.image.split("/").pop();
      const newUrl = BLOB_BASE_URL + filename;
      await doc.ref.update({ image: newUrl });
      updated = true;
    }

    // Example: update 'gallery' array field
    if (Array.isArray(data.gallery)) {
      const newGallery = data.gallery.map((img) =>
        typeof img === "string" ? BLOB_BASE_URL + img.split("/").pop() : img
      );
      await doc.ref.update({ gallery: newGallery });
      updated = true;
    }

    if (updated) {
      console.log(`Updated document: ${doc.id}`);
    }
  }
  console.log("Done updating Firestore image URLs.");
}

updateProjectImages().catch(console.error);
