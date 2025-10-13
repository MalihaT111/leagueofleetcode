import Link from "next/link";
import { Box } from "@mantine/core";

interface AngledButtonProps {
  href?: string;
  label: string;
}

export function AngledButton({ href, label }: AngledButtonProps) {
  const buttonShape = "polygon(0 0, 100% 0, 80% 100%, 0% 100%)"; // angled right edge

  const content = (
    <Box
      style={{
        position: "relative",
        display: "inline-block",
        width: "500px",
        height: "80px", // fixed height for consistent size
        fontFamily: "var(--font-montserrat), sans-serif",
        fontWeight: "bold",
        fontSize: "40px",
        textTransform: "uppercase",
        cursor: "pointer",
      }}
    >
      {/* Shadow layer */}
      <Box
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          width: "100%",
          height: "100%",
          backgroundColor: "#5A5040",
          clipPath: buttonShape,
          zIndex: 0,
        }}
      />

      {/* Yellow button layer */}
      <Box
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#FFBD42",
          color: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          clipPath: buttonShape,
          zIndex: 1,
        }}
      >
        {label}
      </Box>
    </Box>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
