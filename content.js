/* ============================================================================
   content.js  —  THE ONLY FILE YOU NORMALLY EDIT
   ----------------------------------------------------------------------------
   Everything on the site (home page, archive page, every project detail page)
   reads from the SITE object below. Change something here and it updates
   everywhere at once.

   SAFE-EDITING RULES (so nothing breaks):
   1. Only change the text BETWEEN the "quotes". Keep the quotes.
   2. Keep the comma at the end of each line.
   3. To add a piece, copy a whole { ... } block, paste it, edit it.
      To remove one, delete its whole { ... } block (including its comma).
   4. Use real punctuation inside text — ’ “ ” — etc. Apostrophes are fine
      because every value is wrapped in "double quotes".
   5. Don't rename the keys on the left (slug:, title:, image: ...).
   ========================================================================== */

window.SITE = {

  /* ── WORKS ───────────────────────────────────────────────────────────────
     The home page shows the first 6 ("Six recent pieces"); the archive shows
     all of them. Each piece links to  work.html?w=<slug>  automatically.

       slug   unique id, used in the URL + image name. lowercase-with-dashes.
       image  hover thumbnail + detail-page hero. Put the file in  images/
              e.g. images/carry-the-stone.jpg  (leave "" to show the gradient)
       fill   fallback background shown while/if the image is missing.

       url    OPTIONAL. Where the card links to:
                • leave it out      → uses the built-in template  work.html?w=slug
                • "projects/x/..."  → your own hand-built page (big/custom projects)
                • "https://..."     → an external link (opens in a new tab)
              This is how you avoid stuffing a huge project into one file: keep
              the heavy content in its own page and just point the card at it.
     ----------------------------------------------------------------------- */
  works: [
    {
      slug:  "carry-the-stone",
      id:    "ART · 047",
      tag:   "PAINTING",
      title: "Carry the Stone",
      desc:  "Oil on linen, 60 × 80 cm. From a six-piece cycle on inherited objects.",
      year:  "2024",
      image: "images/carry-the-stone.jpg",
      fill:  "linear-gradient(160deg, #c4763f 0%, #5e3618 100%)",
    },
    {
      slug:  "atlas-of-migration",
      id:    "GIS · 008",
      tag:   "MAP",
      title: "Atlas of Migration",
      desc:  "Interactive atlas of European movement, 2015–2024. QGIS · D3 · deck.gl.",
      year:  "2025",
      image: "images/atlas-of-migration.jpg",
      fill:  "repeating-linear-gradient(90deg, rgba(255,255,255,.06) 0 1px, transparent 1px 14px), repeating-linear-gradient(0deg, rgba(255,255,255,.06) 0 1px, transparent 1px 14px), linear-gradient(180deg, #1f2a3a 0%, #0c121c 100%)",
    },
    {
      slug:  "roots",
      id:    "CODE · 004",
      tag:   "OPEN SOURCE",
      title: "Roots",
      desc:  "A small, deliberately quiet programming language for sketching. Rust.",
      year:  "2024",
      image: "images/roots.jpg",
      fill:  "radial-gradient(circle at 30% 40%, rgba(29,45,255,.6), transparent 50%), radial-gradient(circle at 70% 60%, rgba(255,80,40,.5), transparent 55%), #0a0a0a",
    },
    {
      slug:  "the-hunger-diaries",
      id:    "ILLO · 021",
      tag:   "EDITORIAL",
      title: "The Hunger Diaries",
      desc:  "Twelve plates for a long-form report on food security in southern Europe.",
      year:  "2024",
      image: "images/the-hunger-diaries.jpg",
      fill:  "linear-gradient(170deg, #8a6f4c 0%, #4a3a26 100%)",
    },
    {
      slug:  "on-the-politics-of-maps",
      id:    "WRITE · 06",
      tag:   "ESSAY",
      title: "On the Politics of Maps",
      desc:  "Long-form essay on cartography as a political act. 7,400 words.",
      year:  "2025",
      image: "images/on-the-politics-of-maps.jpg",
      fill:  "repeating-linear-gradient(45deg, rgba(255,255,255,.08) 0 8px, transparent 8px 18px), linear-gradient(180deg, #2e2925 0%, #0d0b08 100%)",
      // EXAMPLE of a custom page: this long essay has its own hand-built page
      // instead of the generic template, so its 7,400 words live in their own file.
      url:   "projects/on-the-politics-of-maps/index.html",
    },
    {
      slug:  "vienna-by-foot",
      id:    "GIS · 011",
      tag:   "TOOL",
      title: "Vienna by Foot",
      desc:  "A walking-route generator that prefers quiet streets and good light.",
      year:  "2026",
      image: "images/vienna-by-foot.jpg",
      fill:  "radial-gradient(circle at 60% 50%, rgba(255,255,255,.18), transparent 40%), linear-gradient(220deg, #4a5d52 0%, #1a241f 100%)",
    },
    /* --- add more pieces below; they appear in the archive automatically --- */
  ],

  /* ── TIMELINE ────────────────────────────────────────────────────────────
     The progress bar fills itself from the dates. You never touch the bar.
       start  when the item began            "YYYY-MM-DD"
       due    when it's expected to finish   "YYYY-MM-DD"
     The bar shows how far between start and due *today* is. Before start it's
     empty; after due it's full. `when` is just the label shown on the right.
       title  shown in italic (leave "" for none); note  the plain part.
     ----------------------------------------------------------------------- */
  timeline: [
    { id:"PLAN/01", title:"The Atlas Is Not the Land", note:"essay",
      start:"2026-02-01", due:"2026-08-31", when:"Draft / Aug 2026" },
    { id:"PLAN/02", title:"Slow Borders",              note:"solo exhibition",
      start:"2026-01-01", due:"2027-03-01", when:"Opens / Mar 2027" },
    { id:"PLAN/03", title:"",                          note:"Civic mapping toolkit — open source release",
      start:"2025-09-01", due:"2026-12-31", when:"Public / Q4 2026" },
    { id:"PLAN/04", title:"",                          note:"Part-time role · viz / cartography / editorial",
      start:"2026-09-01", due:"2027-06-30", when:"From / Sept 2026" },
  ],

  /* ── CONTACT / ELSEWHERE ─────────────────────────────────────────────────
     icon must be one of: mail, github, instagram, arena, masto, cv
     href is where the link goes; handle is the visible label.
     ----------------------------------------------------------------------- */
  links: [
    { icon:"mail",      label:"Email",     handle:"DataraSnow",             href:"mailto:datarasnow@gmailcom", arrow:"↗" },
    { icon:"github",    label:"GitHub",    handle:"DataraSnow",             href:"https://github.com/DataraSnow", arrow:"↗" },
    { icon:"instagram", label:"Instagram", handle:"DataraArtwork",          href:"https://www.instagram.com/dataraartwork/", arrow:"↗" },
    { icon:"arena",     label:"Are.na",    handle:"/dario-trojan",          href:"https://are.na/dario-trojan", arrow:"↗" },
    { icon:"masto",     label:"Mastodon",  handle:"@dario@mas.to",          href:"https://mas.to/@dario", arrow:"↗" },
    { icon:"cv",        label:"CV · PDF",  handle:"Download · 312 kb",      href:"cv.pdf", arrow:"↓" },
  ],

};
