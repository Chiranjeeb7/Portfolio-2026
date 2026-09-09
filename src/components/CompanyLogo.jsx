import byjusOnDark from "../assets/logos/byjus-ondark.svg";
import byjusOnLight from "../assets/logos/byjus-onlight.svg";
import delhiveryOnDark from "../assets/logos/delhivery-ondark.png";
import delhiveryOnLight from "../assets/logos/delhivery-onlight.png";
import { companies } from "../data/content";
import styles from "./CompanyLogo.module.css";

const LOGOS = {
  current: { onLight: delhiveryOnLight, onDark: delhiveryOnDark, alt: companies.current.name },
  previous: { onLight: byjusOnLight, onDark: byjusOnDark, alt: companies.previous.name },
};

// `company` is "current" | "previous", matching data/content.js's companies map.
export default function CompanyLogo({ company, className = "" }) {
  const logo = LOGOS[company];
  if (!logo) return null;
  return (
    <span className={`${styles.wrap} ${className}`}>
      <img src={logo.onLight} alt={logo.alt} className={`${styles.img} ${styles.onLight}`} />
      <img src={logo.onDark} alt={logo.alt} className={`${styles.img} ${styles.onDark}`} />
    </span>
  );
}
