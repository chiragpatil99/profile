import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "radial-gradient(circle at 20% 20%, #1c2a66 0%, #07080c 55%)",
          color: "#eceef5",
        }}
      >
        <div style={{ fontSize: 28, color: "#38d4f2", marginBottom: 24 }}>{site.titleLine}</div>
        <div style={{ fontSize: 112, fontWeight: 700, letterSpacing: -4 }}>{site.name}</div>
        <div style={{ fontSize: 40, color: "#9aa1b5", marginTop: 16 }}>{site.title}</div>
      </div>
    ),
    size,
  );
}
