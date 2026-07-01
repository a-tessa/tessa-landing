import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** Loads `/public/tessa-short-logo.png` as a data URI for `ImageResponse`. */
export async function loadShortLogoSrc(): Promise<string> {
  const buffer = await readFile(
    join(process.cwd(), "public/tessa-short-logo.png"),
  );
  return `data:image/png;base64,${buffer.toString("base64")}`;
}
