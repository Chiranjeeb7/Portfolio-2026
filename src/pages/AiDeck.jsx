// Interview presentation of my agentic AI work: moving order upload (the
// step every plan depends on) from a bulk CSV upload with an error file to a
// data ingestion agent that reads any source, asks people when it is unsure,
// and opens a spreadsheet-style editor when there is a lot to fix.
// Reached only by typing "#/ai-deck" (optionally "#/ai-deck/<slide>");
// nothing on the site links here and the page asks not to be indexed.
//
// Everything stated on the slides comes from the user's own description of
// the project and from the shipped screens and demo recording. No metrics
// are claimed: none were provided.
import {
  ArrowRight,
  Bot,
  Check,
  Eye,
  FileX,
  Inbox,
  Mail,
  MessageCircle,
  RefreshCw,
  ScanSearch,
  Sheet,
  Sparkles,
  Table2,
  Upload,
  UserCheck,
} from "lucide-react";
import { motion } from "motion/react";
import Deck, { Count, Media, R, Words } from "../components/deck/Deck";
import { rich } from "../components/rich";
import { profile } from "../data/content";
import demoMp4 from "../assets/photos/ai-ingestion-demo.mp4";
import demoPoster from "../assets/photos/ai-ingestion-demo-poster.webp";
import listShot from "../assets/photos/ai-ingestion-list.webp";
import drawerShot from "../assets/photos/ai-ingestion-drawer.webp";
import resolveShot from "../assets/photos/ai-ingestion-resolve.webp";
import fixShot from "../assets/photos/ai-ingestion-fix.webp";
import emailShot from "../assets/photos/ai-ingestion-followup-email.webp";
import whatsappShot from "../assets/photos/ai-ingestion-followup-whatsapp.webp";
import s from "../components/deck/Deck.module.css";

const DEMO = { video: demoMp4, poster: demoPoster };

/* ---------- Shared slide layout: points beside a screenshot ---------- */

function Feature({ kicker, title, points, media, label }) {
  return (
    <div className={s.solution}>
      <div className={s.solutionText}>
        <R as="p" className={s.kicker}>{kicker}</R>
        <Words as="h2" className={s.title} text={title} />
        <ul className={s.points}>
          {points.map((p) => (
            <R as="li" key={p}>
              <Check size={20} strokeWidth={2.2} className={s.proIcon} />
              <span>{rich(p)}</span>
            </R>
          ))}
        </ul>
      </div>
      <R className={s.solutionMedia}>
        <Media media={media} label={label} className={s.fill} />
      </R>
    </div>
  );
}

/* ---------- Slides ---------- */

function Cover() {
  return (
    <div className={s.cover}>
      <div className={s.coverText}>
        <R className={s.tag}>Delhivery · TransportOne TMS · Agentic AI</R>
        <Words as="h1" className={s.display} text="From error files to *an agent that asks*" />
        <R as="p" className={s.lede}>
          Redesigning order upload, the first step of every plan, around a data ingestion agent.
        </R>
        <R className={s.byline}>
          <span className={s.bylineName}>{profile.name}</span>
          <span>Design lead, SaaS & agentic team</span>
        </R>
      </div>
      <R className={s.coverMedia}>
        <Media media={DEMO} label="Data ingestion agent: demo recording" className={s.fill} />
      </R>
    </div>
  );
}

function Hook() {
  return (
    <div className={s.center}>
      <R as="p" className={s.kicker}>Where every plan starts</R>
      <Words className={s.display} text="No orders in, *no plan out.*" />
      <R as="p" className={s.muted}>
        Before a planner can build a single load, every order has to be in the system.
      </R>
    </div>
  );
}

function OldWay() {
  const steps = [
    { Icon: Sheet, text: "Fill the bulk upload CSV" },
    { Icon: Upload, text: "Upload it" },
    { Icon: FileX, text: "Get back an error file" },
    { Icon: Table2, text: "Fix the rows in Excel" },
  ];
  return (
    <div className={s.stack}>
      <Words as="h2" className={s.title} text="Getting orders in meant a bulk upload." />
      <R as="p" className={s.sub}>Typical CSV error handling: the system finds the problems, the user fixes them.</R>
      <R className={s.loop}>
        <ol className={s.loopSteps}>
          {steps.map(({ Icon, text }, i) => (
            <li key={text} className={s.loopStep}>
              <span className={s.iconTile}>
                <Icon size={24} strokeWidth={1.6} />
              </span>
              <span className={s.index}>{String(i + 1).padStart(2, "0")}</span>
              <p className={s.loopText}>{text}</p>
              {i < steps.length - 1 && <ArrowRight className={s.loopArrow} size={26} strokeWidth={1.4} />}
            </li>
          ))}
        </ol>
        <div className={s.loopBack} aria-hidden="true">
          <span>
            <RefreshCw size={16} strokeWidth={2} /> Upload again, and again
          </span>
        </div>
      </R>
    </div>
  );
}

function WhyItHurt() {
  const cards = [
    {
      Icon: Inbox,
      title: "Orders don't arrive as CSVs",
      text: "They come in emails, WhatsApp messages and spreadsheets of every shape. Someone had to retype them into our format first.",
    },
    {
      Icon: FileX,
      title: "Errors came back as a file",
      text: "The user had to find each bad row, fix it offline and upload the whole thing again.",
    },
    {
      Icon: RefreshCw,
      title: "Planning waited on the loop",
      text: "Every round trip held up the step that every plan depends on.",
    },
  ];
  return (
    <div className={s.stack}>
      <Words as="h2" className={s.title} text="The system knew what was wrong. The user did all the work." />
      <div className={s.grid3}>
        {cards.map(({ Icon, title, text }) => (
          <R key={title} className={s.card}>
            <span className={s.iconTile}>
              <Icon size={22} strokeWidth={1.6} />
            </span>
            <h3 className={s.cardTitle}>{title}</h3>
            <p className={s.body}>{text}</p>
          </R>
        ))}
      </div>
    </div>
  );
}

function Shift() {
  return (
    <div className={s.center}>
      <R as="p" className={s.kicker}>The shift</R>
      <Words className={s.display} text="Stop making users fit our format. *Let an agent fit theirs.*" />
      <R as="p" className={s.muted}>The agent does the work. People make the calls.</R>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    { Icon: Inbox, title: "Receive", text: "From email, WhatsApp, a manual upload or SFTP." },
    { Icon: ScanSearch, title: "Understand", text: "Works out what the file is (loads, carriers, facilities, contracts, vehicles) with a confidence score." },
    { Icon: Table2, title: "Extract & create", text: "Pulls out the rows and creates everything that's complete." },
    { Icon: MessageCircle, title: "Follow up", text: "Asks the sender for what's missing, by email and then WhatsApp." },
    { Icon: UserCheck, title: "Escalate", text: "Hands over to a person when it can't resolve something itself." },
  ];
  return (
    <div className={s.stack}>
      <Words as="h2" className={s.title} text="A data ingestion agent, end to end." />
      <div className={s.pipeline}>
        {steps.map(({ Icon, title, text }, i) => (
          <R key={title} className={s.flowStep}>
            <div className={s.flowHead}>
              <span className={`${s.iconTile} ${i === steps.length - 1 ? s.iconTileAccent : ""}`}>
                <Icon size={24} strokeWidth={1.6} />
              </span>
              <span className={s.index}>{String(i + 1).padStart(2, "0")}</span>
              {i < steps.length - 1 && <ArrowRight className={s.flowArrow} size={24} strokeWidth={1.4} />}
            </div>
            <h3 className={s.flowTitle}>{title}</h3>
            <p className={s.bodySmall}>{text}</p>
          </R>
        ))}
      </div>
    </div>
  );
}

function OneInbox() {
  return (
    <Feature
      kicker="One place for everything coming in"
      title="Every source, one list."
      points={[
        "Files from **email, WhatsApp, upload and SFTP**, side by side",
        "Outcomes in plain words: **27 loads created · 13 need attention**",
        "A status that says what's needed: needs review, partial, failed, complete",
      ]}
      media={{ img: listShot }}
      label="Data ingestion: every incoming file with its status and outcome"
    />
  );
}

function ExplainsItself() {
  return (
    <Feature
      kicker="Show the work"
      title="Every file explains what happened."
      points={[
        "A one-line summary of what the agent did and why it needs you",
        "**27 of 40 rows valid**, shown as progress, not as a failure",
        "The original file and email, one click away",
      ]}
      media={{ img: drawerShot }}
      label="A file's overview: summary, rows valid, human action required, source"
    />
  );
}

function AsksFirst() {
  const steps = [
    { Icon: ScanSearch, text: "Classified as **load data (94% confidence)**: headers match the load schema" },
    { Icon: Table2, text: "Extracted 8 rows: **5 complete, 3 missing a destination pincode**" },
    { Icon: Mail, text: "Emailed the sender asking for the pincodes of rows 3, 5 and 7" },
    { Icon: MessageCircle, text: "No reply after 1.5 hours, so it **followed up on WhatsApp**" },
    { Icon: UserCheck, text: "Two attempts unanswered: **escalated to a person, per policy**" },
  ];
  return (
    <div className={s.solution}>
      <div className={s.solutionText}>
        <R as="p" className={s.kicker}>Ask before failing</R>
        <Words as="h2" className={s.title} text="Missing data became a question, not an error." />
        <ol className={s.activity}>
          {steps.map(({ Icon, text }) => (
            <R as="li" key={text}>
              <span className={s.activityIcon}>
                <Icon size={16} strokeWidth={1.8} />
              </span>
              <span>{rich(text)}</span>
            </R>
          ))}
        </ol>
      </div>
      <div className={s.mediaStack}>
        <R className={s.solutionMedia}>
          <Media media={{ img: emailShot }} label="The agent's activity log and the email it sent" className={s.fill} />
        </R>
        <R className={s.solutionMedia}>
          <Media media={{ img: whatsappShot }} label="The WhatsApp follow-up the agent sent" className={s.fill} />
        </R>
      </div>
    </div>
  );
}

function Partial() {
  return (
    <div className={s.stack}>
      <R as="p" className={s.kicker}>Partial success</R>
      <Words className={s.titleLarge} text="Good rows don't wait for *bad ones.*" />
      <R className={s.partial}>
        <div className={s.partialNums}>
          <div>
            <Count className={`${s.statValue} ${s.sageText}`} value="27" />
            <span className={s.statLabel}>loads created straight away</span>
          </div>
          <div>
            <Count className={`${s.statValue} ${s.accent}`} value="13" delay={0.6} />
            <span className={s.statLabel}>rows held for review, with the reason</span>
          </div>
        </div>
        <div className={s.partialBar} aria-hidden="true">
          <motion.span
            style={{ flex: 27, transformOrigin: "left" }}
            variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] } } }}
          />
          <motion.span
            style={{ flex: 13, transformOrigin: "left" }}
            variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] } } }}
          />
        </div>
        <p className={s.body}>From one 40-row file. Planning can start on what's ready while the rest is resolved.</p>
      </R>
    </div>
  );
}

function Spreadsheet() {
  return (
    <Feature
      kicker="When there's a lot to fix"
      title="A spreadsheet, inside the product."
      points={[
        "Problems flagged **in the cell they're in**, not in a separate file",
        "Step through them one by one: **Issue 1 of 14**",
        "Validate when done. No download, no re-upload",
      ]}
      media={{ img: resolveShot }}
      label="Resolve view: the file as an editable grid with issues flagged"
    />
  );
}

function AgentInGrid() {
  return (
    <Feature
      kicker="Resolve by chatting"
      title="An agent that edits the grid with you."
      points={[
        "OneAI takes plain requests: **“Fill the missing destination pincodes”**",
        "It **proposes values in the cell** for you to accept, never silently",
        "Inline checks explain each problem, like a weight that isn't in kg",
      ]}
      media={{ img: fixShot }}
      label="OneAI suggestions in the grid and an inline validation message"
    />
  );
}

function Demo() {
  return (
    <div className={s.stackSnug}>
      <Words as="h2" className={s.title} text="The whole flow, in 47 seconds." />
      <R className={s.demo}>
        <Media media={DEMO} label="Data ingestion agent: full demo" className={s.fill} />
      </R>
    </div>
  );
}

function BeforeAfter() {
  const rows = [
    ["Where orders come from", "One CSV format", "Email, WhatsApp, upload, SFTP"],
    ["Who does the work", "The user, row by row", "The agent; people confirm"],
    ["Missing data", "A line in an error file", "A question to the sender, then a person"],
    ["Fixing errors", "Offline in Excel, then upload again", "In place, with AI suggestions"],
    ["What happened", "A list of errors", "A timeline of every step the agent took"],
  ];
  return (
    <div className={s.stack}>
      <Words as="h2" className={s.title} text="From a form to fill to a teammate that works." />
      <R className={s.compare}>
        <div role="table" aria-label="Before and after">
        <div className={s.compareHead} role="row">
          <span role="columnheader" />
          <span role="columnheader">Before: bulk upload</span>
          <span role="columnheader">After: ingestion agent</span>
        </div>
        {rows.map(([what, before, after]) => (
          <div key={what} className={s.compareRow} role="row">
            <span role="rowheader">{what}</span>
            <span role="cell" className={s.compareBefore}>{before}</span>
            <span role="cell" className={s.compareAfter}>{after}</span>
          </div>
        ))}
        </div>
      </R>
    </div>
  );
}

function Principles() {
  const items = [
    { Icon: Eye, title: "Show the work", text: "Every outcome links to its **source file, email and a step-by-step log**." },
    { Icon: MessageCircle, title: "Ask before failing", text: "Missing data turns into **a question to the sender**, not an error." },
    { Icon: UserCheck, title: "Escalate by policy", text: "**Two follow-ups, then a person**, and the log says why." },
    { Icon: Sparkles, title: "Propose, don't overwrite", text: "The agent **suggests values in the grid**; people accept them." },
  ];
  return (
    <div className={s.stack}>
      <Words as="h2" className={s.title} text="What designing for an agent taught me." />
      <div className={s.grid2}>
        {items.map(({ Icon, title, text }) => (
          <R key={title} className={s.card}>
            <span className={s.iconTile}>
              <Icon size={22} strokeWidth={1.6} />
            </span>
            <h3 className={s.cardTitle}>{title}</h3>
            <p className={s.body}>{rich(text)}</p>
          </R>
        ))}
      </div>
    </div>
  );
}

function Close() {
  return (
    <div className={s.center}>
      <R className={s.iconTileLarge}>
        <Bot size={40} strokeWidth={1.4} />
      </R>
      <Words className={s.display} text="The best error message *is a question.*" />
      <R as="p" className={s.muted}>Thank you. Happy to take questions.</R>
      <R className={s.byline}>
        <span className={s.bylineName}>{profile.name}</span>
        <span>{profile.email}</span>
      </R>
    </div>
  );
}

const SLIDES = [
  { title: "Cover", chapter: "", Body: Cover },
  { title: "No orders, no plan", chapter: "", Body: Hook, tone: "dark" },
  { title: "The bulk upload loop", chapter: "01 · The old way", Body: OldWay },
  { title: "Why it hurt", chapter: "01 · The old way", Body: WhyItHurt },
  { title: "The shift", chapter: "02 · The shift", Body: Shift, tone: "dark" },
  { title: "How the agent works", chapter: "02 · The shift", Body: HowItWorks },
  { title: "One list for every source", chapter: "03 · The experience", Body: OneInbox },
  { title: "Every file explains itself", chapter: "03 · The experience", Body: ExplainsItself },
  { title: "Ask before failing", chapter: "03 · The experience", Body: AsksFirst },
  { title: "Partial success", chapter: "03 · The experience", Body: Partial },
  { title: "Spreadsheet editing", chapter: "03 · The experience", Body: Spreadsheet },
  { title: "OneAI in the grid", chapter: "03 · The experience", Body: AgentInGrid },
  { title: "Demo", chapter: "04 · Demo", Body: Demo },
  { title: "Before and after", chapter: "05 · What changed", Body: BeforeAfter },
  { title: "Design principles", chapter: "06 · Learnings", Body: Principles },
  { title: "Thank you", chapter: "", Body: Close, tone: "dark" },
];

const PRELOAD = [demoPoster, listShot, drawerShot, resolveShot, fixShot, emailShot, whatsappShot];

export default function AiDeck() {
  return (
    <Deck
      slides={SLIDES}
      slug="ai-deck"
      brand="Agentic data ingestion · Delhivery TMS"
      label="Agentic data ingestion presentation"
      preload={PRELOAD}
    />
  );
}
