import type { Locale } from "./types";
import { GUIDE } from "./PageMascot";
import type { NongPlubOutfit } from "./nongPlubData";

/**
 * NONG PLUB, IN THE PICTURE
 * =========================
 * She is not an ornament beside the photograph. She stands IN it, on the
 * photograph's own ground line, cropped by the frame — a character in the
 * scene rather than a cut-out floating on top of one.
 *
 * That is the whole difference between a mascot and a sticker. A sticker
 * is a rectangle of somebody laid over the edge of a picture. A mascot is
 * somebody who is somewhere: her feet are on the ground, the frame cuts
 * her because the camera was closer than she was, and she is lit by the
 * same picture she is standing in.
 *
 * The drawings carry a transparent ground, so she can be placed over a
 * photograph without a paper rectangle announcing that she is an
 * insertion — and the frame's own crop is what grounds her, which is why
 * she needs no drop shadow (and the design law allows none).
 *
 * The city dossier gives her the clothes that city's record gives her, so
 * the guide in the photograph and the guide in the infographic below it
 * are the same person in the same outfit.
 */
export function NongPlubHero({
  outfit,
  locale,
}: {
  outfit: NongPlubOutfit;
  locale: Locale;
}) {
  const figure = GUIDE[outfit];
  return (
    <img
      className="nong-plub-hero-figure"
      src={figure.src}
      width={figure.w}
      height={300}
      loading="eager"
      decoding="async"
      alt={
        locale === "th"
          ? "น้องพลับ ผู้แนะนำข้อมูลเมืองของแพลตฟอร์ม — ภาพประกอบ ไม่ใช่บันทึกการเดินทาง"
          : locale === "zh"
            ? "小普，平台的数据向导——插画，并非到访记录"
            : "Nong Plub, the platform's illustrated guide — an illustration, not a visit record"
      }
    />
  );
}
