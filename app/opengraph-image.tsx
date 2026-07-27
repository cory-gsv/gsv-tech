import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt =
  "Golden State Visions managed IT, secure networks, smart home automation, and audio video services";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logo = await readFile(
    join(process.cwd(), "public", "images", "gsv-logo.png"),
    "base64",
  );

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          color: "#f7f4ec",
          background:
            "linear-gradient(120deg, #15130f 0%, #1d1911 64%, #392f13 100%)",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            border: "2px solid rgba(255, 198, 54, 0.18)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: "64px 72px 68px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "30px",
            }}
          >
            <img
              src={`data:image/png;base64,${logo}`}
              alt=""
              width={164}
              height={80}
              style={{ objectFit: "contain" }}
            />
            <div
              style={{
                display: "flex",
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: "0.18em",
              }}
            >
              GOLDEN STATE <span style={{ color: "#ffc636" }}>&nbsp;VISIONS</span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "980px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "22px",
                color: "#ffc636",
                fontSize: 19,
                fontWeight: 700,
                letterSpacing: "0.16em",
              }}
            >
              NORTHERN CALIFORNIA TECHNOLOGY PARTNER
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 65,
                fontWeight: 700,
                lineHeight: 1.04,
                letterSpacing: "-0.035em",
              }}
            >
              Managed IT, secure networks, and smart-home technology.
            </div>
            <div
              style={{
                display: "flex",
                marginTop: "24px",
                color: "#bbb6aa",
                fontSize: 25,
                lineHeight: 1.35,
              }}
            >
              One accountable local team for businesses and homes.
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
