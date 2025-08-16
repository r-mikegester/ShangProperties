import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface HeroContent {
  backgroundUrl: string;
  headline: string;
  paragraph: string;
}

const HERO_DOC_PATH = "homepage_content/hero";

const HeroEditor: React.FC = () => {
  const [hero, setHero] = useState<HeroContent>({
    backgroundUrl: "",
    headline: "",
    paragraph: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchHero = async () => {
      setLoading(true);
      setError(null);
      try {
        const docRef = doc(db, "homepage_content", "hero");
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setHero(snap.data() as HeroContent);
        }
      } catch (err: any) {
        setError("Failed to load hero content");
      } finally {
        setLoading(false);
      }
    };
    fetchHero();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setHero({ ...hero, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const docRef = doc(db, "homepage_content", "hero");
      await setDoc(docRef, hero, { merge: true });
      setSuccess(true);
    } catch (err: any) {
      setError("Failed to save hero content");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <>
          {/* Live Preview */}
          <div className="mb-6 p-4 bg-gray-50 rounded border border-gray-200">
            <div className="mb-2 font-bold text-lg text-[#b08b2e]">Live Preview</div>
            <div className="mb-2">
              <img src={hero.backgroundUrl} alt="Hero Background" className="w-full max-w-md h-32 object-cover rounded" />
            </div>
            <div className="mb-1 text-2xl font-bold text-[#b08b2e]">{hero.headline}</div>
            <div className="text-gray-700">{hero.paragraph}</div>
          </div>
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>
            <div>
              <label className="block font-semibold mb-1">Background Image URL</label>
              <input
                type="text"
                name="backgroundUrl"
                value={hero.backgroundUrl}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                placeholder="Image URL"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Headline</label>
              <input
                type="text"
                name="headline"
                value={hero.headline}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                placeholder="Headline"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Paragraph</label>
              <textarea
                name="paragraph"
                value={hero.paragraph}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1 min-h-[80px]"
                placeholder="Paragraph"
              />
            </div>
            {error && <div className="text-red-500">{error}</div>}
            {success && <div className="text-green-600">Saved!</div>}
            <button
              type="submit"
              className="bg-[#b08b2e] text-white px-4 py-2 rounded font-semibold hover:bg-[#a07a1e] transition"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default HeroEditor;
