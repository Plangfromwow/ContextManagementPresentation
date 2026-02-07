const path = require("path");
const fs = require("fs");
const os = require("os");
const { execFileSync } = require("child_process");
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaBrain, FaSearch, FaClipboardList, FaCode, FaRobot,
  FaProjectDiagram, FaLayerGroup, FaCogs, FaCheckCircle,
  FaExclamationTriangle, FaArrowRight, FaUsersCog, FaRocket,
  FaFolderOpen, FaTerminal, FaFileAlt, FaSitemap, FaEye,
  FaLightbulb, FaBullseye, FaChartLine, FaTools
} = require("react-icons/fa");

// ── Icon Helper ──
function renderIconSvg(IconComponent, color = "#000000", size = 256) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
}

async function iconToBase64Png(IconComponent, color, size = 256) {
  const svg = renderIconSvg(IconComponent, color, size);
  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + pngBuffer.toString("base64");
}

// ── Color Palette: Midnight Executive ──
const C = {
  navy:      "1E2761",
  navyLight: "2A3575",
  ice:       "CADCFC",
  white:     "FFFFFF",
  accent:    "4A90D9",
  accentBright: "5BA3F5",
  muted:     "8899BB",
  darkText:  "1A1F36",
  lightText: "E8EDF5",
  success:   "34D399",
  warn:      "FBBF24",
  danger:    "F87171",
  cardBg:    "F4F7FC",
  divider:   "3D4E8A",
};

// ── Factory Functions (never reuse objects) ──
const mkShadow = () => ({ type: "outer", blur: 8, offset: 3, angle: 135, color: "000000", opacity: 0.18 });

// ── Reusable slide footer ──
function addFooter(slide, slideNum, totalSlides) {
  slide.addText(`${slideNum} / ${totalSlides}`, {
    x: 8.6, y: 5.15, w: 1, h: 0.3,
    fontSize: 9, color: C.muted, align: "right", fontFace: "Calibri",
  });
}

// ── Small accent bar at top of slide ──
function addTopAccent(slide) {
  slide.addShape("rect", {
    x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent },
  });
}

function fixNotesMasterOrder(pptxPath) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "pptx-fix-"));
  const unpackScript = path.join(__dirname, "..", ".github", "skills", "pptx", "scripts", "office", "unpack.py");
  const packScript = path.join(__dirname, "..", ".github", "skills", "pptx", "scripts", "office", "pack.py");
  const presentationXmlPath = path.join(tempDir, "ppt", "presentation.xml");

  try {
    execFileSync("python", [unpackScript, pptxPath, tempDir], { stdio: "ignore" });

    const xml = fs.readFileSync(presentationXmlPath, "utf-8");
    const notesMatch = xml.match(/\s*<p:notesMasterIdLst>[\s\S]*?<\/p:notesMasterIdLst>/);
    if (!notesMatch) {
      return;
    }

    const xmlWithoutNotes = xml.replace(notesMatch[0], "");
    const notesBlock = notesMatch[0].trimStart();

    let updatedXml = xmlWithoutNotes;
    const masterCloseMatch = xmlWithoutNotes.match(/<\/p:sldMasterIdLst>/);
    if (masterCloseMatch) {
      updatedXml = xmlWithoutNotes.replace(masterCloseMatch[0], `${masterCloseMatch[0]}\n  ${notesBlock}`);
    }

    if (updatedXml !== xml) {
      fs.writeFileSync(presentationXmlPath, updatedXml, "utf-8");
    }

    execFileSync("python", [packScript, tempDir, pptxPath, "--validate", "false"], { stdio: "ignore" });
  } catch (error) {
    console.warn("Warning: PPTX notes master reorder failed:", error.message);
  }
}

async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Jacob";
  pres.title = "Context Engineering for AI Coding Agents";

  const TOTAL = 14;

  // ── Pre-render all icons ──
  const icons = {};
  const iconMap = {
    brain: [FaBrain, C.accent],
    search: [FaSearch, C.white],
    clipboard: [FaClipboardList, C.white],
    code: [FaCode, C.white],
    robot: [FaRobot, C.accent],
    project: [FaProjectDiagram, C.accent],
    layers: [FaLayerGroup, C.accent],
    cogs: [FaCogs, C.accent],
    check: [FaCheckCircle, C.success],
    warn: [FaExclamationTriangle, C.warn],
    arrow: [FaArrowRight, C.accent],
    usersCog: [FaUsersCog, C.accent],
    rocket: [FaRocket, C.white],
    folder: [FaFolderOpen, C.accent],
    terminal: [FaTerminal, C.accent],
    file: [FaFileAlt, C.accent],
    sitemap: [FaSitemap, C.accent],
    eye: [FaEye, C.accent],
    lightbulb: [FaLightbulb, C.warn],
    bullseye: [FaBullseye, C.accent],
    chart: [FaChartLine, C.accent],
    tools: [FaTools, C.accent],
    brainWhite: [FaBrain, C.white],
    checkWhite: [FaCheckCircle, C.white],
    rocketNavy: [FaRocket, C.accent],
    cogsWhite: [FaCogs, C.white],
    searchAccent: [FaSearch, C.accent],
    clipboardAccent: [FaClipboardList, C.accent],
    codeAccent: [FaCode, C.accent],
  };

  for (const [key, [Icon, color]] of Object.entries(iconMap)) {
    icons[key] = await iconToBase64Png(Icon, `#${color}`);
  }

  // =====================================================================
  // SLIDE 1 — Title
  // =====================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C.navy };

    // Decorative shapes
    slide.addShape("rect", { x: 0, y: 0, w: 10, h: 0.08, fill: { color: C.accent } });
    slide.addShape("rect", { x: 0, y: 5.545, w: 10, h: 0.08, fill: { color: C.accent } });

    // Icon
    slide.addImage({ data: icons.brain, x: 4.5, y: 0.6, w: 1, h: 1 });

    // Title
    slide.addText("Context Engineering", {
      x: 0.5, y: 1.7, w: 9, h: 0.9,
      fontSize: 44, fontFace: "Georgia", bold: true, color: C.white,
      align: "center", margin: 0,
    });
    slide.addText("for AI Coding Agents", {
      x: 0.5, y: 2.65, w: 9, h: 0.7,
      fontSize: 32, fontFace: "Georgia", color: C.ice,
      align: "center", margin: 0,
    });

    // Subtitle
    slide.addText("Getting AI to Deliver Real Results in Our Microservice Codebase", {
      x: 1.5, y: 3.6, w: 7, h: 0.5,
      fontSize: 16, fontFace: "Calibri", color: C.muted, align: "center",
    });

    // Divider
    slide.addShape("rect", { x: 3.5, y: 4.2, w: 3, h: 0.03, fill: { color: C.divider } });

    // Date
    slide.addText("February 2026", {
      x: 1.5, y: 4.5, w: 7, h: 0.4,
      fontSize: 14, fontFace: "Calibri", color: C.muted, align: "center",
    });

    addFooter(slide, 1, TOTAL);
  }

  // =====================================================================
  // SLIDE 2 — The Problem: AI in Complex Codebases
  // =====================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C.white };
    addTopAccent(slide);

    slide.addText("The Problem: AI in Complex Codebases", {
      x: 0.6, y: 0.3, w: 8.8, h: 0.7,
      fontSize: 36, fontFace: "Georgia", bold: true, color: C.darkText, margin: 0,
    });

    // Left column — stats
    slide.addShape("rect", {
      x: 0.5, y: 1.3, w: 4.3, h: 3.8,
      fill: { color: C.cardBg }, shadow: mkShadow(),
    });
    slide.addShape("rect", {
      x: 0.5, y: 1.3, w: 0.08, h: 3.8, fill: { color: C.danger },
    });

    slide.addText("Stanford Study Findings", {
      x: 0.85, y: 1.45, w: 3.8, h: 0.45,
      fontSize: 18, fontFace: "Georgia", bold: true, color: C.darkText, margin: 0,
    });

    slide.addText([
      { text: "AI-generated code often results in ", options: { breakLine: false } },
      { text: "rework", options: { bold: true, breakLine: false } },
      { text: " — diminishing perceived productivity gains", options: { breakLine: true } },
    ], {
      x: 0.85, y: 2.0, w: 3.7, h: 0.7,
      fontSize: 13, fontFace: "Calibri", color: C.darkText, paraSpaceAfter: 6,
    });

    slide.addText([
      { text: "AI tools are ", options: { breakLine: false } },
      { text: "counter-productive", options: { bold: true, breakLine: false } },
      { text: " in large established codebases and complex tasks", options: { breakLine: true } },
    ], {
      x: 0.85, y: 2.85, w: 3.7, h: 0.8,
      fontSize: 13, fontFace: "Calibri", color: C.darkText,
    });

    slide.addText("Great for greenfield. Struggles with brownfield.", {
      x: 0.85, y: 3.8, w: 3.7, h: 0.5,
      fontSize: 14, fontFace: "Calibri", italic: true, color: C.accent,
    });

    // Right column — common complaints
    slide.addShape("rect", {
      x: 5.2, y: 1.3, w: 4.3, h: 3.8,
      fill: { color: C.cardBg }, shadow: mkShadow(),
    });
    slide.addShape("rect", {
      x: 5.2, y: 1.3, w: 0.08, h: 3.8, fill: { color: C.warn },
    });

    slide.addText("What Teams Say", {
      x: 5.55, y: 1.45, w: 3.8, h: 0.45,
      fontSize: 18, fontFace: "Georgia", bold: true, color: C.darkText, margin: 0,
    });

    const complaints = [
      '"Too much slop."',
      '"Tech debt factory."',
      '"Doesn\'t work in big repos."',
      '"Doesn\'t work for complex systems."',
    ];
    complaints.forEach((c, i) => {
      slide.addImage({ data: icons.warn, x: 5.55, y: 2.05 + i * 0.65, w: 0.3, h: 0.3 });
      slide.addText(c, {
        x: 5.95, y: 2.05 + i * 0.65, w: 3.3, h: 0.4,
        fontSize: 14, fontFace: "Calibri", color: C.darkText, valign: "middle",
      });
    });

    addFooter(slide, 2, TOTAL);
  }

  // =====================================================================
  // SLIDE 3 — The Root Cause: Context
  // =====================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C.navy };

    slide.addText("The Root Cause", {
      x: 0.6, y: 0.3, w: 8.8, h: 0.7,
      fontSize: 36, fontFace: "Georgia", bold: true, color: C.white, margin: 0,
    });

    // Big callout
    slide.addShape("rect", {
      x: 0.8, y: 1.3, w: 8.4, h: 1.6,
      fill: { color: C.navyLight }, shadow: mkShadow(),
    });

    slide.addImage({ data: icons.lightbulb, x: 1.1, y: 1.55, w: 0.7, h: 0.7 });

    slide.addText("LLMs are stateless functions. The context window is the ONLY lever you have to affect output quality.", {
      x: 2.0, y: 1.4, w: 6.9, h: 1.4,
      fontSize: 18, fontFace: "Georgia", color: C.white, valign: "middle",
    });

    // Four optimization pillars
    const pillars = [
      { label: "Correctness", desc: "No wrong information", icon: icons.check },
      { label: "Completeness", desc: "No missing context", icon: icons.searchAccent },
      { label: "Size", desc: "Minimal noise", icon: icons.bullseye },
      { label: "Trajectory", desc: "Stay on track", icon: icons.arrow },
    ];

    pillars.forEach((p, i) => {
      const x = 0.8 + i * 2.2;
      slide.addShape("rect", {
        x, y: 3.3, w: 2.0, h: 1.8,
        fill: { color: C.navyLight }, shadow: mkShadow(),
      });
      slide.addImage({ data: p.icon, x: x + 0.75, y: 3.45, w: 0.5, h: 0.5 });
      slide.addText(p.label, {
        x, y: 4.0, w: 2.0, h: 0.4,
        fontSize: 16, fontFace: "Georgia", bold: true, color: C.white, align: "center", margin: 0,
      });
      slide.addText(p.desc, {
        x, y: 4.4, w: 2.0, h: 0.4,
        fontSize: 12, fontFace: "Calibri", color: C.muted, align: "center",
      });
    });

    addFooter(slide, 3, TOTAL);
  }

  // =====================================================================
  // SLIDE 4 — The Naive Approach
  // =====================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C.white };
    addTopAccent(slide);

    slide.addText("The Naive Approach", {
      x: 0.6, y: 0.3, w: 8.8, h: 0.7,
      fontSize: 36, fontFace: "Georgia", bold: true, color: C.darkText, margin: 0,
    });

    slide.addText("How most of us start with AI coding agents", {
      x: 0.6, y: 1.05, w: 8.8, h: 0.4,
      fontSize: 14, fontFace: "Calibri", color: C.muted,
    });

    // Left — the chatbot approach
    slide.addShape("rect", {
      x: 0.5, y: 1.6, w: 4.3, h: 3.5,
      fill: { color: C.cardBg }, shadow: mkShadow(),
    });
    slide.addShape("rect", {
      x: 0.5, y: 1.6, w: 0.08, h: 3.5, fill: { color: C.danger },
    });

    slide.addImage({ data: icons.warn, x: 0.85, y: 1.75, w: 0.4, h: 0.4 });
    slide.addText("Chat Until It Breaks", {
      x: 1.35, y: 1.75, w: 3.2, h: 0.4,
      fontSize: 17, fontFace: "Georgia", bold: true, color: C.darkText, valign: "middle", margin: 0,
    });

    slide.addText([
      { text: "Talk back and forth until you:", options: { breakLine: true } },
      { text: "Run out of context", options: { bullet: true, breakLine: true } },
      { text: "Give up in frustration", options: { bullet: true, breakLine: true } },
      { text: "The agent starts apologizing", options: { bullet: true, breakLine: true } },
      { text: "", options: { breakLine: true } },
      { text: "Context fills with glob/grep/read noise, leaving little room for actual problem-solving.", options: { italic: true } },
    ], {
      x: 0.85, y: 2.3, w: 3.7, h: 2.5,
      fontSize: 13, fontFace: "Calibri", color: C.darkText, paraSpaceAfter: 4,
    });

    // Right — slightly smarter
    slide.addShape("rect", {
      x: 5.2, y: 1.6, w: 4.3, h: 3.5,
      fill: { color: C.cardBg }, shadow: mkShadow(),
    });
    slide.addShape("rect", {
      x: 5.2, y: 1.6, w: 0.08, h: 3.5, fill: { color: C.warn },
    });

    slide.addImage({ data: icons.arrow, x: 5.55, y: 1.75, w: 0.4, h: 0.4 });
    slide.addText("Start Over With Steering", {
      x: 6.05, y: 1.75, w: 3.2, h: 0.4,
      fontSize: 17, fontFace: "Georgia", bold: true, color: C.darkText, valign: "middle", margin: 0,
    });

    slide.addText([
      { text: "Restart sessions with more guidance:", options: { breakLine: true } },
      { text: '"Use XYZ approach because ABC won\'t work"', options: { italic: true, breakLine: true } },
      { text: "", options: { breakLine: true } },
      { text: "Better, but still reactive. You\'re fixing errors after they happen instead of preventing them.", options: { breakLine: true } },
    ], {
      x: 5.55, y: 2.3, w: 3.7, h: 2.5,
      fontSize: 13, fontFace: "Calibri", color: C.darkText, paraSpaceAfter: 4,
    });

    addFooter(slide, 4, TOTAL);
  }

  // =====================================================================
  // SLIDE 5 — Intentional Compaction
  // =====================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C.white };
    addTopAccent(slide);

    slide.addText("Intentional Compaction", {
      x: 0.6, y: 0.3, w: 8.8, h: 0.7,
      fontSize: 36, fontFace: "Georgia", bold: true, color: C.darkText, margin: 0,
    });

    slide.addText("The breakthrough: treat context as a managed resource", {
      x: 0.6, y: 1.05, w: 8.8, h: 0.4,
      fontSize: 14, fontFace: "Calibri", color: C.muted,
    });

    // What eats context
    slide.addShape("rect", {
      x: 0.5, y: 1.6, w: 4.3, h: 3.5,
      fill: { color: C.cardBg }, shadow: mkShadow(),
    });
    slide.addShape("rect", {
      x: 0.5, y: 1.6, w: 0.08, h: 3.5, fill: { color: C.danger },
    });

    slide.addText("What Eats Context?", {
      x: 0.85, y: 1.7, w: 3.7, h: 0.45,
      fontSize: 17, fontFace: "Georgia", bold: true, color: C.darkText, margin: 0,
    });

    const eaters = [
      "Searching for files across services",
      "Understanding code flow & dependencies",
      "Applying and reverting edits",
      "Test/build output logs",
      "Huge JSON blobs from tool calls",
    ];
    eaters.forEach((e, i) => {
      slide.addText(e, {
        x: 0.85, y: 2.3 + i * 0.5, w: 3.7, h: 0.4,
        fontSize: 13, fontFace: "Calibri", color: C.darkText,
        bullet: true, valign: "middle",
      });
    });

    // The solution
    slide.addShape("rect", {
      x: 5.2, y: 1.6, w: 4.3, h: 3.5,
      fill: { color: C.cardBg }, shadow: mkShadow(),
    });
    slide.addShape("rect", {
      x: 5.2, y: 1.6, w: 0.08, h: 3.5, fill: { color: C.success },
    });

    slide.addText("The Solution", {
      x: 5.55, y: 1.7, w: 3.7, h: 0.45,
      fontSize: 17, fontFace: "Georgia", bold: true, color: C.darkText, margin: 0,
    });

    slide.addText([
      { text: "Pause and distill work into structured artifacts before context fills up.", options: { breakLine: true } },
      { text: "", options: { breakLine: true } },
      { text: '"Write everything so far to progress.md — the goal, approach, steps done, and current issue."', options: { italic: true, breakLine: true } },
      { text: "", options: { breakLine: true } },
      { text: "Keep context utilization in the 40-60% range.", options: { bold: true } },
    ], {
      x: 5.55, y: 2.3, w: 3.7, h: 2.5,
      fontSize: 13, fontFace: "Calibri", color: C.darkText, paraSpaceAfter: 4,
    });

    addFooter(slide, 5, TOTAL);
  }

  // =====================================================================
  // SLIDE 6 — Frequent Intentional Compaction: Research → Plan → Implement
  // =====================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C.navy };

    slide.addText("The Framework: Research, Plan, Implement", {
      x: 0.6, y: 0.3, w: 8.8, h: 0.7,
      fontSize: 34, fontFace: "Georgia", bold: true, color: C.white, margin: 0,
    });

    slide.addText("Design your entire workflow around context management", {
      x: 0.6, y: 1.05, w: 8.8, h: 0.4,
      fontSize: 14, fontFace: "Calibri", color: C.muted,
    });

    // Three step cards
    const steps = [
      {
        num: "1", title: "Research", icon: icons.search,
        desc: "Understand the codebase, relevant files, data flow, and potential causes. Use subagents to keep the main context clean.",
        color: C.accent,
      },
      {
        num: "2", title: "Plan", icon: icons.clipboard,
        desc: "Outline exact steps, files to edit, and precise testing/verification for each phase. Human reviews the plan.",
        color: C.accentBright,
      },
      {
        num: "3", title: "Implement", icon: icons.code,
        desc: "Execute phase by phase. Compact status back into the plan file after each phase is verified.",
        color: C.success,
      },
    ];

    steps.forEach((s, i) => {
      const x = 0.6 + i * 3.0;
      const w = 2.8;

      // Card background
      slide.addShape("rect", {
        x, y: 1.7, w, h: 3.3,
        fill: { color: C.navyLight }, shadow: mkShadow(),
      });

      // Top color bar
      slide.addShape("rect", {
        x, y: 1.7, w, h: 0.08, fill: { color: s.color },
      });

      // Number circle
      slide.addShape("oval", {
        x: x + w / 2 - 0.3, y: 2.0, w: 0.6, h: 0.6,
        fill: { color: s.color },
      });
      slide.addText(s.num, {
        x: x + w / 2 - 0.3, y: 2.0, w: 0.6, h: 0.6,
        fontSize: 22, fontFace: "Georgia", bold: true, color: C.white,
        align: "center", valign: "middle",
      });

      // Title
      slide.addText(s.title, {
        x, y: 2.8, w, h: 0.45,
        fontSize: 20, fontFace: "Georgia", bold: true, color: C.white,
        align: "center", margin: 0,
      });

      // Description
      slide.addText(s.desc, {
        x: x + 0.2, y: 3.35, w: w - 0.4, h: 1.4,
        fontSize: 12.5, fontFace: "Calibri", color: C.ice, align: "left",
        valign: "top", paraSpaceAfter: 4,
      });

      // Arrow between cards (not after last)
      if (i < 2) {
        slide.addImage({ data: icons.arrow, x: x + w + 0.02, y: 3.15, w: 0.15, h: 0.15 });
      }
    });

    addFooter(slide, 6, TOTAL);
  }

  // =====================================================================
  // SLIDE 7 — Sub-Agents: Context Control
  // =====================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C.white };
    addTopAccent(slide);

    slide.addText("Sub-Agents: Context Control", {
      x: 0.6, y: 0.3, w: 8.8, h: 0.7,
      fontSize: 36, fontFace: "Georgia", bold: true, color: C.darkText, margin: 0,
    });

    slide.addText("Subagents aren't about role-playing. They're about keeping context clean.", {
      x: 0.6, y: 1.05, w: 8.8, h: 0.4,
      fontSize: 14, fontFace: "Calibri", color: C.muted,
    });

    // How it works
    slide.addShape("rect", {
      x: 0.5, y: 1.6, w: 4.3, h: 3.5,
      fill: { color: C.cardBg }, shadow: mkShadow(),
    });
    slide.addShape("rect", {
      x: 0.5, y: 1.6, w: 0.08, h: 3.5, fill: { color: C.accent },
    });

    slide.addImage({ data: icons.sitemap, x: 0.85, y: 1.75, w: 0.4, h: 0.4 });
    slide.addText("How It Works", {
      x: 1.35, y: 1.75, w: 3.2, h: 0.4,
      fontSize: 17, fontFace: "Georgia", bold: true, color: C.darkText, valign: "middle", margin: 0,
    });

    slide.addText([
      { text: "Main agent stays focused on the task", options: { bullet: true, breakLine: true } },
      { text: "Subagents do searching/summarizing in a fresh context window", options: { bullet: true, breakLine: true } },
      { text: "Results return as compact, structured summaries", options: { bullet: true, breakLine: true } },
      { text: "Main context never fills with glob/grep/read noise", options: { bullet: true, breakLine: true } },
    ], {
      x: 0.85, y: 2.3, w: 3.7, h: 2.5,
      fontSize: 13, fontFace: "Calibri", color: C.darkText, paraSpaceAfter: 6,
    });

    // Our agents
    slide.addShape("rect", {
      x: 5.2, y: 1.6, w: 4.3, h: 3.5,
      fill: { color: C.cardBg }, shadow: mkShadow(),
    });
    slide.addShape("rect", {
      x: 5.2, y: 1.6, w: 0.08, h: 3.5, fill: { color: C.accent },
    });

    slide.addImage({ data: icons.robot, x: 5.55, y: 1.75, w: 0.4, h: 0.4 });
    slide.addText("Example Agents", {
      x: 6.05, y: 1.75, w: 3.3, h: 0.4,
      fontSize: 17, fontFace: "Georgia", bold: true, color: C.darkText, valign: "middle", margin: 0,
    });

    const agents = [
      ["codebase-locator", "Find WHERE files live"],
      ["codebase-analyzer", "Understand HOW code works"],
      ["pattern-finder", "Find similar implementations"],
      ["database-query", "Query schemas & data"],
      ["docs-locator", "Find existing documentation"],
    ];
    agents.forEach((a, i) => {
      slide.addText(a[0], {
        x: 5.55, y: 2.35 + i * 0.5, w: 1.8, h: 0.35,
        fontSize: 11, fontFace: "Consolas", color: C.accent, valign: "middle", bold: true,
      });
      slide.addText(a[1], {
        x: 7.35, y: 2.35 + i * 0.5, w: 2.0, h: 0.35,
        fontSize: 11, fontFace: "Calibri", color: C.darkText, valign: "middle",
      });
    });

    addFooter(slide, 7, TOTAL);
  }

  // =====================================================================
  // SLIDE 8 — Human Leverage
  // =====================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C.navy };

    slide.addText("Human Leverage: Where to Focus Review", {
      x: 0.6, y: 0.3, w: 8.8, h: 0.7,
      fontSize: 34, fontFace: "Georgia", bold: true, color: C.white, margin: 0,
    });

    // Key insight callout
    slide.addShape("rect", {
      x: 0.8, y: 1.2, w: 8.4, h: 1.2,
      fill: { color: C.navyLight }, shadow: mkShadow(),
    });
    slide.addImage({ data: icons.lightbulb, x: 1.1, y: 1.4, w: 0.6, h: 0.6 });
    slide.addText("A bad line of code is a bad line. A bad line in a plan leads to hundreds of bad lines. A bad line of research leads to thousands.", {
      x: 1.9, y: 1.25, w: 7.0, h: 1.1,
      fontSize: 15, fontFace: "Georgia", color: C.white, valign: "middle",
    });

    // Three-tier leverage — increasing impact left to right
    const tiers = [
      { label: "Code Review", impact: "LOW", lines: "Catch bugs line by line", color: C.danger, h: 1.4 },
      { label: "Plan Review", impact: "MEDIUM", lines: "Catch wrong approaches before 100s of lines", color: C.warn, h: 1.8 },
      { label: "Research Review", impact: "HIGH", lines: "Catch wrong assumptions before 1000s of lines", color: C.success, h: 2.2 },
    ];

    tiers.forEach((t, i) => {
      const x = 0.8 + i * 3.0;
      const y = 2.7 + (2.2 - t.h);
      slide.addShape("rect", {
        x, y, w: 2.8, h: t.h,
        fill: { color: t.color, transparency: 20 }, shadow: mkShadow(),
      });
      slide.addText(t.impact, {
        x, y: y + 0.15, w: 2.8, h: 0.35,
        fontSize: 14, fontFace: "Calibri", bold: true, color: t.color, align: "center",
        charSpacing: 4,
      });
      slide.addText(t.label, {
        x, y: y + 0.5, w: 2.8, h: 0.4,
        fontSize: 17, fontFace: "Georgia", bold: true, color: C.white, align: "center", margin: 0,
      });
      slide.addText(t.lines, {
        x: x + 0.15, y: y + t.h - 0.5, w: 2.5, h: 0.4,
        fontSize: 11, fontFace: "Calibri", color: C.ice, align: "center",
      });
    });

    addFooter(slide, 8, TOTAL);
  }

  // =====================================================================
  // SLIDE 9 — Why This Matters for Microservices
  // =====================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C.white };
    addTopAccent(slide);

    slide.addText("Why This Matters for Our Microservices", {
      x: 0.6, y: 0.3, w: 8.8, h: 0.7,
      fontSize: 34, fontFace: "Georgia", bold: true, color: C.darkText, margin: 0,
    });

    // 2x2 grid of challenges
    const challenges = [
      {
        title: "Cross-Service Context",
        desc: "A single feature may touch 4-5 services. Without context steering, the agent only sees one service at a time.",
        icon: icons.project,
      },
      {
        title: "Shared Contracts & Schemas",
        desc: "API contracts, message formats, and shared DTOs must stay consistent. Research agents can map dependencies first.",
        icon: icons.layers,
      },
      {
        title: "Complex Data Flows",
        desc: "Events, queues, and async patterns that span services. Plans need to capture the full flow before coding begins.",
        icon: icons.cogs,
      },
      {
        title: "Team Mental Alignment",
        desc: "When AI writes 90% of the code, specs and plans become the shared language. Review plans, not just PRs.",
        icon: icons.usersCog,
      },
    ];

    challenges.forEach((c, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 0.5 + col * 4.7;
      const y = 1.3 + row * 2.1;

      slide.addShape("rect", {
        x, y, w: 4.3, h: 1.8,
        fill: { color: C.cardBg }, shadow: mkShadow(),
      });

      slide.addImage({ data: c.icon, x: x + 0.2, y: y + 0.2, w: 0.45, h: 0.45 });
      slide.addText(c.title, {
        x: x + 0.75, y: y + 0.2, w: 3.4, h: 0.4,
        fontSize: 16, fontFace: "Georgia", bold: true, color: C.darkText, valign: "middle", margin: 0,
      });
      slide.addText(c.desc, {
        x: x + 0.2, y: y + 0.75, w: 3.9, h: 0.9,
        fontSize: 12, fontFace: "Calibri", color: C.darkText,
      });
    });

    addFooter(slide, 9, TOTAL);
  }

  // =====================================================================
  // SLIDE 10 — Copilot CLI & Instruction Files
  // =====================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C.white };
    addTopAccent(slide);

    slide.addText("Tooling: Copilot CLI & Instruction Files", {
      x: 0.6, y: 0.3, w: 8.8, h: 0.7,
      fontSize: 34, fontFace: "Georgia", bold: true, color: C.darkText, margin: 0,
    });

    // Left — Copilot CLI setup
    slide.addShape("rect", {
      x: 0.5, y: 1.2, w: 4.3, h: 3.7,
      fill: { color: C.cardBg }, shadow: mkShadow(),
    });
    slide.addShape("rect", {
      x: 0.5, y: 1.2, w: 0.08, h: 3.7, fill: { color: C.accent },
    });

    slide.addImage({ data: icons.terminal, x: 0.85, y: 1.35, w: 0.4, h: 0.4 });
    slide.addText("Copilot CLI", {
      x: 1.35, y: 1.35, w: 3.2, h: 0.4,
      fontSize: 17, fontFace: "Georgia", bold: true, color: C.darkText, valign: "middle", margin: 0,
    });

    slide.addText([
      { text: "Install:", options: { bold: true, breakLine: true } },
      { text: "  npm install -g @github/copilot", options: { fontFace: "Consolas", fontSize: 11, breakLine: true } },
      { text: "", options: { breakLine: true } },
      { text: "Key Commands:", options: { bold: true, breakLine: true } },
      { text: "  /model  — select AI model", options: { fontFace: "Consolas", fontSize: 11, breakLine: true } },
      { text: "  /init   — setup instructions", options: { fontFace: "Consolas", fontSize: 11, breakLine: true } },
      { text: "  @file   — include files in context", options: { fontFace: "Consolas", fontSize: 11, breakLine: true } },
      { text: "", options: { breakLine: true } },
      { text: "Models we use:", options: { bold: true, breakLine: true } },
      { text: "  Claude Opus 4.6", options: { fontFace: "Consolas", fontSize: 11, breakLine: true } },
      { text: "  GPT-5.3-Codex", options: { fontFace: "Consolas", fontSize: 11, breakLine: true } },
      { text: "", options: { breakLine: true } },
      { text: "Reads instruction files automatically from the repo.", options: { italic: true } },
    ], {
      x: 0.85, y: 1.85, w: 3.7, h: 3.2,
      fontSize: 13, fontFace: "Calibri", color: C.darkText, paraSpaceAfter: 2,
    });

    // Right — instruction file hierarchy
    slide.addShape("rect", {
      x: 5.2, y: 1.2, w: 4.3, h: 3.7,
      fill: { color: C.cardBg }, shadow: mkShadow(),
    });
    slide.addShape("rect", {
      x: 5.2, y: 1.2, w: 0.08, h: 3.7, fill: { color: C.accent },
    });

    slide.addImage({ data: icons.file, x: 5.55, y: 1.35, w: 0.4, h: 0.4 });
    slide.addText("Instruction File Hierarchy", {
      x: 6.05, y: 1.35, w: 3.3, h: 0.4,
      fontSize: 17, fontFace: "Georgia", bold: true, color: C.darkText, valign: "middle", margin: 0,
    });

    const instFiles = [
      "CLAUDE.md / AGENTS.md (git root)",
      ".github/instructions/**/*.instructions.md",
      ".github/copilot-instructions.md",
      "$HOME/.copilot/copilot-instructions.md",
      "COPILOT_CUSTOM_INSTRUCTIONS_DIRS",
    ];
    instFiles.forEach((f, i) => {
      slide.addText(`${i + 1}.`, {
        x: 5.55, y: 1.95 + i * 0.55, w: 0.3, h: 0.35,
        fontSize: 13, fontFace: "Georgia", bold: true, color: C.accent, align: "center",
      });
      slide.addText(f, {
        x: 5.85, y: 1.95 + i * 0.55, w: 3.5, h: 0.35,
        fontSize: 11, fontFace: "Consolas", color: C.darkText, valign: "middle",
      });
    });

    addFooter(slide, 10, TOTAL);
  }

  // =====================================================================
  // SLIDE 11 — The .github Folder Structure
  // =====================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C.navy };

    slide.addText("The .github Folder: Your AI Config", {
      x: 0.6, y: 0.3, w: 8.8, h: 0.7,
      fontSize: 34, fontFace: "Georgia", bold: true, color: C.white, margin: 0,
    });

    // Folder tree card
    slide.addShape("rect", {
      x: 0.5, y: 1.2, w: 4.3, h: 3.7,
      fill: { color: C.navyLight }, shadow: mkShadow(),
    });

    slide.addImage({ data: icons.folder, x: 0.8, y: 1.35, w: 0.4, h: 0.4 });
    slide.addText("Folder Structure", {
      x: 1.3, y: 1.35, w: 3.2, h: 0.4,
      fontSize: 17, fontFace: "Georgia", bold: true, color: C.white, valign: "middle", margin: 0,
    });

    const tree = [
      ".github/",
      "  agents/              # Specialized subagents",
      "  prompts/             # Reusable templates",
      "  skills/              # Extended capabilities",
      "  copilot-instructions.md",
    ];
    slide.addText(tree.join("\n"), {
      x: 0.8, y: 1.95, w: 3.8, h: 3.0,
      fontSize: 12, fontFace: "Consolas", color: C.ice,
      valign: "top", paraSpaceAfter: 2,
    });

    // Purpose descriptions
    slide.addShape("rect", {
      x: 5.2, y: 1.2, w: 4.3, h: 3.7,
      fill: { color: C.navyLight }, shadow: mkShadow(),
    });

    const items = [
      { name: "agents/", desc: "Specialized helpers for research, analysis, pattern-finding" },
      { name: "prompts/", desc: "Reusable templates for research, planning, handoffs" },
      { name: "skills/", desc: "Extended capabilities: docx, pdf, xlsx, pptx" },
      { name: "copilot-instructions.md", desc: "Global context: what the project is, core principles" },
    ];

    items.forEach((item, i) => {
      const y = 1.35 + i * 0.75;
      slide.addText(item.name, {
        x: 5.5, y, w: 3.8, h: 0.3,
        fontSize: 13, fontFace: "Consolas", bold: true, color: C.accentBright,
      });
      slide.addText(item.desc, {
        x: 5.5, y: y + 0.3, w: 3.8, h: 0.35,
        fontSize: 11, fontFace: "Calibri", color: C.ice,
      });
    });

    addFooter(slide, 11, TOTAL);
  }

  // =====================================================================
  // SLIDE 12 — Real-World Results
  // =====================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C.white };
    addTopAccent(slide);

    slide.addText("Real-World Results", {
      x: 0.6, y: 0.3, w: 8.8, h: 0.7,
      fontSize: 36, fontFace: "Georgia", bold: true, color: C.darkText, margin: 0,
    });

    slide.addText("Evidence from teams applying context engineering", {
      x: 0.6, y: 1.05, w: 8.8, h: 0.4,
      fontSize: 14, fontFace: "Calibri", color: C.muted,
    });

    // Big stat callouts across three columns
    const stats = [
      { number: "35k", unit: "LOC", desc: "shipped in 7 hours on a 300k LOC Rust codebase (BAML)", color: C.accent },
      { number: "6", unit: "PRs / day", desc: "sustained output per developer with research/plan/implement", color: C.success },
      { number: "10", unit: "PRs in 8 days", desc: "by an intern on their first week using this workflow", color: C.accentBright },
    ];

    stats.forEach((s, i) => {
      const x = 0.6 + i * 3.0;
      slide.addShape("rect", {
        x, y: 1.6, w: 2.8, h: 3.4,
        fill: { color: C.cardBg }, shadow: mkShadow(),
      });
      slide.addShape("rect", {
        x, y: 1.6, w: 2.8, h: 0.06, fill: { color: s.color },
      });
      slide.addText(s.number, {
        x, y: 2.0, w: 2.8, h: 0.8,
        fontSize: 52, fontFace: "Georgia", bold: true, color: s.color, align: "center", margin: 0,
      });
      slide.addText(s.unit, {
        x, y: 2.85, w: 2.8, h: 0.4,
        fontSize: 16, fontFace: "Calibri", bold: true, color: C.darkText, align: "center",
      });
      slide.addText(s.desc, {
        x: x + 0.2, y: 3.3, w: 2.4, h: 1.4,
        fontSize: 12, fontFace: "Calibri", color: C.darkText, align: "center", valign: "top",
      });
    });

    addFooter(slide, 12, TOTAL);
  }

  // =====================================================================
  // SLIDE 13 — Honest Assessment: Not Magic
  // =====================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C.white };
    addTopAccent(slide);

    slide.addText("Honest Assessment: This Is Not Magic", {
      x: 0.6, y: 0.3, w: 8.8, h: 0.7,
      fontSize: 34, fontFace: "Georgia", bold: true, color: C.darkText, margin: 0,
    });

    // What works
    slide.addShape("rect", {
      x: 0.5, y: 1.2, w: 4.3, h: 3.8,
      fill: { color: C.cardBg }, shadow: mkShadow(),
    });
    slide.addShape("rect", {
      x: 0.5, y: 1.2, w: 0.08, h: 3.8, fill: { color: C.success },
    });

    slide.addImage({ data: icons.check, x: 0.85, y: 1.35, w: 0.4, h: 0.4 });
    slide.addText("What Works", {
      x: 1.35, y: 1.35, w: 3.2, h: 0.4,
      fontSize: 17, fontFace: "Georgia", bold: true, color: C.darkText, valign: "middle", margin: 0,
    });

    const works = [
      "Works in brownfield codebases",
      "Solves complex problems",
      "Produces merge-worthy code (no slop)",
      "Maintains team mental alignment",
      "Specs become shared documentation",
    ];
    works.forEach((w, i) => {
      slide.addText(w, {
        x: 0.85, y: 1.95 + i * 0.5, w: 3.7, h: 0.4,
        fontSize: 13, fontFace: "Calibri", color: C.darkText,
        bullet: true, valign: "middle",
      });
    });

    // What to watch out for
    slide.addShape("rect", {
      x: 5.2, y: 1.2, w: 4.3, h: 3.8,
      fill: { color: C.cardBg }, shadow: mkShadow(),
    });
    slide.addShape("rect", {
      x: 5.2, y: 1.2, w: 0.08, h: 3.8, fill: { color: C.warn },
    });

    slide.addImage({ data: icons.warn, x: 5.55, y: 1.35, w: 0.4, h: 0.4 });
    slide.addText("Watch Out For", {
      x: 6.05, y: 1.35, w: 3.2, h: 0.4,
      fontSize: 17, fontFace: "Georgia", bold: true, color: C.darkText, valign: "middle", margin: 0,
    });

    const watchOuts = [
      "You must engage deeply — no autopilot",
      "Research can be wrong — always verify",
      "Complex dependency trees can mislead",
      "Need at least one domain expert",
      "Some problems are just hard",
    ];
    watchOuts.forEach((w, i) => {
      slide.addText(w, {
        x: 5.55, y: 1.95 + i * 0.5, w: 3.7, h: 0.4,
        fontSize: 13, fontFace: "Calibri", color: C.darkText,
        bullet: true, valign: "middle",
      });
    });

    addFooter(slide, 13, TOTAL);
  }

  // =====================================================================
  // SLIDE 14 — Next Steps / Call to Action
  // =====================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C.navy };

    slide.addShape("rect", { x: 0, y: 0, w: 10, h: 0.08, fill: { color: C.accent } });
    slide.addShape("rect", { x: 0, y: 5.545, w: 10, h: 0.08, fill: { color: C.accent } });

    slide.addImage({ data: icons.rocketNavy, x: 4.5, y: 0.5, w: 1, h: 1 });

    slide.addText("Next Steps for Our Team", {
      x: 0.5, y: 1.7, w: 9, h: 0.7,
      fontSize: 36, fontFace: "Georgia", bold: true, color: C.white, align: "center", margin: 0,
    });

    // Three action cards
    const actions = [
      {
        num: "1",
        title: "Setup Instructions",
        desc: "Add copilot-instructions.md and CLAUDE.md to our key repos with project context",
      },
      {
        num: "2",
        title: "Build Custom Agents",
        desc: "Create specialized subagents for our services, database, and integration patterns",
      },
      {
        num: "3",
        title: "Adopt the Workflow",
        desc: "Start with Research → Plan → Implement on the next complex ticket as a pilot",
      },
    ];

    actions.forEach((a, i) => {
      const x = 0.6 + i * 3.0;

      slide.addShape("rect", {
        x, y: 2.7, w: 2.8, h: 2.3,
        fill: { color: C.navyLight }, shadow: mkShadow(),
      });
      slide.addShape("rect", {
        x, y: 2.7, w: 2.8, h: 0.06, fill: { color: C.accent },
      });

      slide.addText(a.num, {
        x, y: 2.85, w: 2.8, h: 0.45,
        fontSize: 28, fontFace: "Georgia", bold: true, color: C.accent, align: "center",
      });
      slide.addText(a.title, {
        x: x + 0.2, y: 3.3, w: 2.4, h: 0.4,
        fontSize: 15, fontFace: "Georgia", bold: true, color: C.white, align: "center", margin: 0,
      });
      slide.addText(a.desc, {
        x: x + 0.2, y: 3.75, w: 2.4, h: 1.0,
        fontSize: 12, fontFace: "Calibri", color: C.ice, align: "center",
      });
    });

    addFooter(slide, 14, TOTAL);
  }

  // ── Write file ──
  const outputPath = path.join(__dirname, "..", "presentations", "Context-Engineering-Presentation-v3.pptx");
  await pres.writeFile({ fileName: outputPath });
  fixNotesMasterOrder(outputPath);
  console.log(`Presentation saved to: ${outputPath}`);
}

main().catch(console.error);
