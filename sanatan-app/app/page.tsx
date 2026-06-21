"use client";

import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { AuthPanel } from "@/components/AuthPanel";
import { CosmicScene } from "@/components/CosmicScene";
import { allScriptures, dailyWisdom, mahapuranas, quoteOfDay, type Scripture, vedas } from "@/lib/scriptures";

gsap.registerPlugin(ScrollTrigger);

const sectionAnim = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75 } },
};

type AdminForm = {
  title: string;
  language: string;
  author: string;
  translator: string;
  category: string;
  description: string;
  provider: "s3" | "cloudinary";
};

function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState<Array<{ id: number; x: number; y: number; glyph: string }>>([]);

  useEffect(() => {
    let id = 0;
    const onMove = (event: MouseEvent) => {
      const next = { x: event.clientX, y: event.clientY };
      setPos(next);
      setTrail((old) => {
        const glyph = Math.random() > 0.9 ? "ॐ" : "";
        const item = { id: id++, x: next.x, y: next.y, glyph };
        return [...old.slice(-18), item];
      });
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <div className="custom-cursor" style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }} />
      {trail.map((item, i) => (
        <span
          key={item.id}
          className="cursor-trail"
          style={{
            transform: `translate(${item.x}px, ${item.y}px) scale(${0.4 + i / 35})`,
            opacity: i / trail.length,
          }}
        >
          {item.glyph}
        </span>
      ))}
    </>
  );
}

function ScriptureCard({ scripture, onOpen }: { scripture: Scripture; onOpen: (scripture: Scripture) => void }) {
  return (
    <motion.article
      className="gold-card group scripture-card"
      whileHover={{ y: -8, rotateX: 1.2, rotateY: -1.2 }}
      transition={{ type: "spring", stiffness: 120, damping: 16 }}
    >
      <h3>{scripture.name}</h3>
      <p className="sanskrit">{scripture.sanskrit}</p>
      <p>{scripture.description}</p>
      <div className="card-meta">
        <p>{scripture.estimatedVerses}</p>
        <p>{scripture.historicalSignificance}</p>
      </div>
      <button className="btn btn-secondary" onClick={() => onOpen(scripture)}>
        Open
      </button>
    </motion.article>
  );
}

function Reader({ scripture, onClose }: { scripture: Scripture; onClose: () => void }) {
  const [chapterId, setChapterId] = useState(scripture.chapters[0]?.id ?? 1);
  const [search, setSearch] = useState("");
  const [fontSize, setFontSize] = useState(20);
  const [lightMode, setLightMode] = useState(false);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [fullscreen, setFullscreen] = useState(false);

  const chapters = useMemo(
    () => scripture.chapters.filter((c) => c.title.toLowerCase().includes(search.toLowerCase())),
    [scripture.chapters, search],
  );

  const current = scripture.chapters.find((c) => c.id === chapterId) ?? scripture.chapters[0];
  const progress = ((chapterId - 1) / Math.max(scripture.chapters.length - 1, 1)) * 100;

  return (
    <div className={`reader-overlay ${fullscreen ? "fullscreen" : ""}`}>
      <div className={`reader-shell ${lightMode ? "light" : "dark"}`}>
        <aside>
          <h3>Table of Contents</h3>
          <input placeholder="Search chapter" value={search} onChange={(e) => setSearch(e.target.value)} />
          <ul>
            {chapters.map((chapter) => (
              <li key={chapter.id}>
                <button onClick={() => setChapterId(chapter.id)}>{chapter.title}</button>
              </li>
            ))}
          </ul>
        </aside>
        <main style={{ fontSize }}>
          <header>
            <h2>{scripture.name}</h2>
            <p className="sanskrit">{scripture.sanskrit}</p>
            <div className="reader-actions">
              <button onClick={() => setLightMode((v) => !v)}>{lightMode ? "Dark" : "Light"} Mode</button>
              <button onClick={() => setFontSize((v) => Math.max(v - 2, 16))}>A-</button>
              <button onClick={() => setFontSize((v) => Math.min(v + 2, 28))}>A+</button>
              <button onClick={() => setFullscreen((v) => !v)}>Fullscreen</button>
              <button
                onClick={() =>
                  setBookmarks((old) =>
                    old.includes(chapterId) ? old.filter((id) => id !== chapterId) : [...old, chapterId],
                  )
                }
              >
                Bookmark
              </button>
              <button onClick={onClose}>Close</button>
            </div>
          </header>
          <div className="reader-progress">
            <span style={{ width: `${progress}%` }} />
          </div>
          <motion.article
            key={current.id}
            className="page-flip"
            initial={{ opacity: 0, rotateY: -12, x: 20 }}
            animate={{ opacity: 1, rotateY: 0, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h3>{current.title}</h3>
            <p>
              {current.summary} This manuscript-inspired reader supports chapter navigation, in-text searching,
              highlights workflow, and mindful study rhythm. Use bookmarks to revisit important passages and
              continue reading seamlessly.
            </p>
            <p>
              Verse Count: {current.verses}. Bookmarked Chapters: {bookmarks.length || "None"}.
            </p>
            <section className="download-grid">
              {scripture.resources.map((resource) => (
                <a key={resource.title} href={resource.href} className="download-card">
                  <strong>{resource.type.toUpperCase()}</strong>
                  <p>{resource.title}</p>
                </a>
              ))}
            </section>
          </motion.article>
        </main>
      </div>
    </div>
  );
}

export default function Home() {
  const { data: session } = useSession();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(allScriptures);
  const [active, setActive] = useState<Scripture | null>(null);
  const [randomVerse, setRandomVerse] = useState("Tap to reveal a random verse.");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [adminForm, setAdminForm] = useState<AdminForm>({
    title: "",
    language: "",
    author: "",
    translator: "",
    category: "",
    description: "",
    provider: "s3",
  });

  useEffect(() => {
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results);
    }, 220);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const timeline = gsap.timeline({ defaults: { ease: "power2.out" } });
    timeline.fromTo(".hero h1", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1 });
    timeline.fromTo(".hero p", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.6");

    gsap.utils.toArray<HTMLElement>("section").forEach((section) => {
      gsap.fromTo(
        section,
        { y: 26, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
          },
        },
      );
    });

    gsap.to(".temple-layer", {
      yPercent: -10,
      scrollTrigger: {
        trigger: ".page-shell",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    return () => {
      timeline.kill();
      ScrollTrigger.getAll().forEach((item) => item.kill());
    };
  }, []);

  async function fetchRandomVerse() {
    const res = await fetch("/api/verse/random");
    const data = await res.json();
    setRandomVerse(data.verse);
  }

  async function handleUploadSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!uploadFile) {
      setUploadStatus("Select a file before uploading.");
      return;
    }

    setUploadStatus("Preparing signed upload...");
    const signedRes = await fetch("/api/admin/upload/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: uploadFile.name,
        mimeType: uploadFile.type || "application/octet-stream",
        provider: adminForm.provider,
      }),
    });

    if (!signedRes.ok) {
      setUploadStatus("Could not create signed upload request.");
      return;
    }

    const signed = await signedRes.json();
    let publicUrl = signed.uploadUrl;

    if (!signed.mock) {
      if (signed.provider === "s3") {
        await fetch(signed.uploadUrl, {
          method: "PUT",
          headers: signed.headers,
          body: uploadFile,
        });
        publicUrl = signed.uploadUrl.split("?")[0];
      }

      if (signed.provider === "cloudinary") {
        const form = new FormData();
        Object.entries(signed.fields ?? {}).forEach(([key, value]) => form.append(key, String(value)));
        form.append("file", uploadFile);

        const uploaded = await fetch(signed.uploadUrl, {
          method: "POST",
          body: form,
        });
        const body = await uploaded.json();
        publicUrl = body.secure_url ?? signed.uploadUrl;
      }
    }

    const completeRes = await fetch("/api/admin/upload/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: adminForm.title,
        language: adminForm.language,
        author: adminForm.author,
        translator: adminForm.translator,
        category: adminForm.category,
        description: adminForm.description,
        storageProvider: signed.provider,
        objectKey: signed.objectKey,
        publicUrl,
        mimeType: uploadFile.type,
        sizeBytes: uploadFile.size,
      }),
    });

    if (completeRes.ok) {
      setUploadStatus(signed.mock ? "Simulated upload completed and metadata stored." : "Upload and metadata persistence complete.");
    } else {
      setUploadStatus("Upload metadata failed.");
    }
  }

  return (
    <div className="page-shell">
      <CosmicScene />
      <CustomCursor />

      <div className="animated-bg" aria-hidden>
        <div className="day-night" />
        <div className="temple-layer" />
        <div className="mandala mandala-a" />
        <div className="mandala mandala-b" />
        {Array.from({ length: 18 }).map((_, i) => (
          <span key={`petal-${i}`} className="petal" style={{ left: `${(i * 7) % 100}%`, animationDelay: `${i * 0.8}s` }} />
        ))}
        {Array.from({ length: 50 }).map((_, i) => (
          <span key={`star-${i}`} className="star" style={{ left: `${(i * 9) % 100}%`, top: `${(i * 13) % 100}%`, animationDelay: `${i * 0.2}s` }} />
        ))}
        <div className="smoke" />
      </div>

      <header className="hero">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
          Sanatan Knowledge Archive
        </motion.h1>
        <p>Explore the Eternal Wisdom of the Vedas and Puranas</p>
        <div className="hero-actions">
          <a href="#vedas" className="btn">Explore Vedas</a>
          <a href="#puranas" className="btn btn-secondary">Explore Puranas</a>
        </div>
      </header>

      <AuthPanel session={session} signIn={signIn} signOut={signOut} />

      <section className="utility-grid">
        <article className="glass-card">
          <h3>Sanskrit Quote of the Day</h3>
          <p className="sanskrit">{quoteOfDay.sanskrit}</p>
          <p>{quoteOfDay.transliteration}</p>
          <p>{quoteOfDay.meaning}</p>
        </article>
        <article className="glass-card">
          <h3>Daily Spiritual Wisdom</h3>
          <p>{dailyWisdom[new Date().getDate() % dailyWisdom.length]}</p>
        </article>
        <article className="glass-card">
          <h3>Random Verse Generator</h3>
          <p>{randomVerse}</p>
          <button className="btn btn-secondary" onClick={fetchRandomVerse}>Generate Verse</button>
        </article>
      </section>

      <section className="search-wrap glass-card">
        <h3>Global Scripture Search</h3>
        <input
          placeholder="Search by scripture, chapter, verse, keyword, language, translator"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <p>{results.length} animated search result(s) found.</p>
      </section>

      <motion.section id="vedas" variants={sectionAnim} initial="hidden" whileInView="show" viewport={{ once: true }}>
        <h2>The Four Vedas</h2>
        <div className="catalog-grid">
          {vedas.map((scripture) => (
            <ScriptureCard key={scripture.id} scripture={scripture} onOpen={setActive} />
          ))}
        </div>
      </motion.section>

      <motion.section id="puranas" variants={sectionAnim} initial="hidden" whileInView="show" viewport={{ once: true }}>
        <h2>The Eighteen Mahapuranas</h2>
        <div className="catalog-grid">
          {mahapuranas.map((scripture) => (
            <ScriptureCard key={scripture.id} scripture={scripture} onOpen={setActive} />
          ))}
        </div>
      </motion.section>

      <section className="admin-panel glass-card" id="admin">
        <h2>Resource Management Panel</h2>
        <p>Upload PDFs, EPUBs, scanned manuscripts, translation assets, images, and recitations.</p>
        <form className="admin-grid" onSubmit={handleUploadSubmit}>
          <input placeholder="Title" value={adminForm.title} onChange={(e) => setAdminForm((v) => ({ ...v, title: e.target.value }))} />
          <input placeholder="Language" value={adminForm.language} onChange={(e) => setAdminForm((v) => ({ ...v, language: e.target.value }))} />
          <input placeholder="Author" value={adminForm.author} onChange={(e) => setAdminForm((v) => ({ ...v, author: e.target.value }))} />
          <input placeholder="Translator" value={adminForm.translator} onChange={(e) => setAdminForm((v) => ({ ...v, translator: e.target.value }))} />
          <input placeholder="Category" value={adminForm.category} onChange={(e) => setAdminForm((v) => ({ ...v, category: e.target.value }))} />
          <textarea placeholder="Description" value={adminForm.description} onChange={(e) => setAdminForm((v) => ({ ...v, description: e.target.value }))} />
          <select value={adminForm.provider} onChange={(e) => setAdminForm((v) => ({ ...v, provider: e.target.value as "s3" | "cloudinary" }))}>
            <option value="s3">AWS S3 Signed Upload</option>
            <option value="cloudinary">Cloudinary Signed Upload</option>
          </select>
          <label className="file-input">Upload Resource<input type="file" onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)} /></label>
          <button className="btn" type="submit">Save Metadata + Upload</button>
        </form>
        <p>{uploadStatus}</p>
      </section>

      <section className="community glass-card">
        <h2>Community Discussion</h2>
        <p>Favorites, reading history, notes, highlights, and discussion channels are now scaffolded with user persistence primitives.</p>
      </section>

      {active ? <Reader scripture={active} onClose={() => setActive(null)} /> : null}
    </div>
  );
}
