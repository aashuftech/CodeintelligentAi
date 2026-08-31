import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 96,
          background: "linear-gradient(135deg, #4338ca 0%, #6366f1 50%, #a855f7 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          borderRadius: "40px",
          fontWeight: 900,
          fontFamily: "monospace",
          boxShadow: "0 20px 40px rgba(99, 102, 241, 0.4)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          &gt;_
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
