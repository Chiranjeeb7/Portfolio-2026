import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import byjusOnDark from "../assets/logos/byjus-ondark.svg";
import byjusOnLight from "../assets/logos/byjus-onlight.svg";
import delhiveryOnDark from "../assets/logos/delhivery-ondark.png";
import delhiveryOnLight from "../assets/logos/delhivery-onlight.png";
import profilePhoto from "../assets/photos/profile.webp";
import { profile } from "../data/content";
import MilestonesGrid from "./MilestonesGrid";
import RevealText from "./motion/RevealText";
import { useIntro } from "./intro/introState";
import styles from "./Hero.module.css";

const EASE = [0.16, 1, 0.3, 1];
// `play` false holds the element at its start pose (while the intro runs).
const rise = (delay, play = true) => ({
  initial: { opacity: 0, y: 24 },
  animate: play ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
  transition: { duration: 1.1, ease: EASE, delay },
});

export default function Hero() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  // After the intro loader, the copy plays its entrance once the pixels
  // have landed; the timeline panel needs none (the pixels built it).
  const { ready, played } = useIntro();

  // As the hero scrolls away, the copy drifts up faster than the activity
  // panel and fades: a depth cue that hands focus to the next section.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const panelY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  // The line grid lights up around the cursor. Written straight to CSS
  // variables, so pointer movement never re-renders React.
  const onPointerMove = (e) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
    ref.current.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const motionOff = !!reduce;

  return (
    <section id="home" ref={ref} className={styles.hero} onPointerMove={onPointerMove}>
      <div className={styles.lines} aria-hidden="true" />
      <div className={styles.spotlight} aria-hidden="true" />

      <div className={`container ${styles.grid}`}>
        <motion.div className={styles.textCol} style={motionOff ? undefined : { y: textY, opacity: fade }}>
          <div className={styles.intro}>
            <motion.p className={styles.greeting} {...(motionOff ? {} : rise(0.05, ready))}>
              Hey, I'm
              <span className={styles.avatar}>
                <img src={profilePhoto} alt="" width="64" height="64" />
              </span>
              {profile.shortName}.
            </motion.p>
            <RevealText
              as="h1"
              trigger="mount"
              play={ready}
              delay={0.2}
              stagger={0.06}
              className={styles.heading}
              emClassName={styles.emphasis}
              text="curious by default, and I build until it's *trusted*."
            />
            <motion.p className={styles.subhead} {...(motionOff ? {} : rise(0.85, ready))}>
              Product Designer &amp; Builder
            </motion.p>
          </div>

          <motion.div className={styles.roleChips} {...(motionOff ? {} : rise(1, ready))}>
            <div className={styles.roleChip}>
              <span>Currently Working with</span>
              <img
                src={delhiveryOnLight}
                alt="Delhivery"
                className={`${styles.logo} ${styles.logoLight}`}
              />
              <img
                src={delhiveryOnDark}
                alt="Delhivery"
                className={`${styles.logo} ${styles.logoDark}`}
              />
            </div>
            <div className={styles.roleChip}>
              <span>Previously Worked with</span>
              <img
                src={byjusOnLight}
                alt="BYJU'S"
                className={`${styles.logo} ${styles.byjusLogo} ${styles.logoLight}`}
              />
              <img
                src={byjusOnDark}
                alt="BYJU'S"
                className={`${styles.logo} ${styles.byjusLogo} ${styles.logoDark}`}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Outer layer owns the scroll parallax, inner the entrance, so the
            two never fight over the same transform. */}
        <motion.div className={styles.panelCol} style={motionOff ? undefined : { y: panelY }}>
          <motion.div
            className={styles.panelEnter}
            {...(motionOff || played
              ? {}
              : {
                  initial: { opacity: 0, y: 48, rotateX: 14 },
                  animate: { opacity: 1, y: 0, rotateX: 0 },
                  transition: { duration: 1.4, ease: EASE, delay: 0.35 },
                })}
          >
            <MilestonesGrid />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
