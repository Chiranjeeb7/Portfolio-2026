import byjusOnDark from "../assets/logos/byjus-ondark.svg";
import byjusOnLight from "../assets/logos/byjus-onlight.svg";
import delhiveryOnDark from "../assets/logos/delhivery-ondark.png";
import delhiveryOnLight from "../assets/logos/delhivery-onlight.png";
import { profile } from "../data/content";
import MilestonesGrid from "./MilestonesGrid";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section id="home" className={`container ${styles.hero}`}>
      <div className={styles.grid}>
        <div className={styles.textCol}>
          <div>
            <p className={styles.greeting}>Hey, I'm {profile.shortName}.</p>
            <h1 className={styles.heading}>
              I design products that turn <em>complexity</em> into confidence.
            </h1>
            <p className={styles.subhead}>
              Product designer &amp; design engineer with 6 years shaping B2B SaaS, enterprise
              systems, ed-tech, e-commerce, and logistics platforms — end to end, from research to
              shipped code.
            </p>
          </div>

          <div className={styles.roleChips}>
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
          </div>
        </div>

        <MilestonesGrid />
      </div>
    </section>
  );
}
