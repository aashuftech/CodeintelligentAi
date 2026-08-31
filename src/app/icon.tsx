import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "nodejs";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation for Favicon
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 18,
          background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          borderRadius: "8px",
          fontWeight: 900,
          fontFamily: "monospace",
          boxShadow: "0 4px 12px rgba(79, 70, 229, 0.5)",
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
