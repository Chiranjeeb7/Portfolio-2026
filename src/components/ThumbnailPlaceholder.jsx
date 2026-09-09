import { ImageIcon } from "lucide-react";
import styles from "./ThumbnailPlaceholder.module.css";

// Stands in for a real project thumbnail/screenshot until one is supplied —
// deliberately marked as a placeholder rather than an illustration someone
// could mistake for finished art.
export default function ThumbnailPlaceholder() {
  return (
    <div className={styles.placeholder}>
      <ImageIcon size={22} strokeWidth={1.5} />
      <span>Thumbnail coming soon</span>
    </div>
  );
}
