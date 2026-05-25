import { ImageResponse } from "next/og";

export const runtime     = "edge";
export const size        = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)",
          borderRadius: "7px",
        }}
      >
        {/* White V mark */}
        <svg width="22" height="22" viewBox="0 0 44 44" fill="none">
          <path d="M2 3 L13 3 L22 33 L31 3 L42 3 L22 43 Z" fill="white" />
        </svg>
      </div>
    ),
    { width: 32, height: 32 },
  );
}
