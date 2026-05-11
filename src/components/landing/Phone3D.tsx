"use client";

/**
 * Phone3D — a procedural 3D phone built in @react-three/fiber.
 *
 * Geometry:
 *   - Body: rounded box (drei) with a metallic clearcoat material.
 *   - Bezel: an inset darker plane.
 *   - Screen: a plane backdrop, plus a drei <Html transform> overlay
 *     mounting the existing React mockup at its native 320×696 size.
 *
 * Why this overlay shape: the mockups in src/components/landing/mockups/
 * were authored against PhoneFrame's 320×696 inner-screen surface and
 * use absolute positioning that depends on those exact dimensions
 * (e.g. ".txn-1 { top: 384px }"). They have no inherent background or
 * status bar — PhoneFrame supplies all of that chrome. To render them
 * inside our 3D phone we recreate the same 320×696 surface here, with
 * status bar (9:41) + dynamic island + home indicator, and let the
 * mockup do its absolute-positioned magic inside.
 */

import { ComponentType, ReactNode } from "react";
import { Html, RoundedBox } from "@react-three/drei";

// Inner screen dimensions in CSS pixels. Match PhoneFrame's
// PHONE_SCREEN_WIDTH/HEIGHT exactly so mockup positioning lands.
export const PHONE3D_SCREEN_PX_W = 320;
export const PHONE3D_SCREEN_PX_H = 696;

// World-unit dimensions of the 3D body. Aspect ratio matches the
// inner screen plus generous bezel.
const BODY_W = 1.0;
const BODY_H = BODY_W * (PHONE3D_SCREEN_PX_H / PHONE3D_SCREEN_PX_W) * 1.06;
const BODY_D = 0.085;
const CORNER_R = 0.115;

interface Phone3DProps {
  Mockup: ComponentType;
  /** Optional overlay rendered inside the screen, on top of the mockup. */
  screenOverlay?: ReactNode;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  ariaLabel?: string;
}

export function Phone3D({
  Mockup,
  screenOverlay,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  ariaLabel,
}: Phone3DProps) {
  // The screen plane in 3D space. Slightly inset from the body edges.
  const screenWorldW = BODY_W - 0.08;
  const screenWorldH = BODY_H - 0.16;
  // drei's <Html transform> renders the DOM at its native CSS pixel
  // size when scale=1 (perspective-projected by the camera). The phone
  // body footprint on screen at the camera config (z=3.4, fov=30) lands
  // close to the DOM's native 320×696 px, so scale=1 fills the screen
  // plane. We trim a hair so it never visually overruns the bezel.
  const htmlScale = 0.95;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* ── Body shell (extruded rounded box, metallic clearcoat) ── */}
      <RoundedBox
        args={[BODY_W, BODY_H, BODY_D]}
        radius={CORNER_R}
        smoothness={6}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color="#0E0E14"
          metalness={0.85}
          roughness={0.32}
          clearcoat={0.9}
          clearcoatRoughness={0.18}
          reflectivity={0.55}
        />
      </RoundedBox>

      {/* ── Inner bezel (the dark frame just inside the body edge) ── */}
      <mesh position={[0, 0, BODY_D / 2 + 0.001]}>
        <planeGeometry args={[BODY_W - 0.04, BODY_H - 0.06]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* ── Screen plane backdrop (matches phone-screen token color) ── */}
      <mesh position={[0, 0, BODY_D / 2 + 0.0025]}>
        <planeGeometry args={[screenWorldW, screenWorldH]} />
        <meshStandardMaterial color="#0F0F14" />
      </mesh>

      {/* ── HTML overlay: 320×696 screen surface with phone chrome.
          Sits ~5mm in front of the WebGL screen plane so it composites
          cleanly above the canvas pixels. We let drei manage zIndexRange
          (default places HTML above the canvas DOM-side). ── */}
      <Html
        transform
        position={[0, 0, BODY_D / 2 + 0.012]}
        scale={htmlScale}
        center={false}
      >
        <ScreenSurface ariaLabel={ariaLabel}>
          <Mockup />
          {screenOverlay}
        </ScreenSurface>
      </Html>
    </group>
  );
}

/**
 * ScreenSurface — recreates PhoneFrame's inner-screen chrome
 * (background, dynamic island, status bar, home indicator) inside
 * our 3D phone's HTML overlay so the absolute-positioned mockups
 * render correctly.
 */
function ScreenSurface({
  ariaLabel,
  children,
}: {
  ariaLabel?: string;
  children: ReactNode;
}) {
  return (
    <div
      role="img"
      aria-label={ariaLabel}
      style={{
        position: "relative",
        width: PHONE3D_SCREEN_PX_W,
        height: PHONE3D_SCREEN_PX_H,
        overflow: "hidden",
        background: "var(--phone-screen, #0F0F14)",
        color: "var(--phone-screen-fg, #FAFAFA)",
        fontFeatureSettings: '"tnum", "ss01"',
        // Decorative; user shouldn't tap into the embedded mockup.
        pointerEvents: "none",
        // Inter is loaded at the html root via next/font; cascade lands here
        // through the portal'd document context.
        fontFamily: "var(--font-body), -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Dynamic island */}
      <div
        style={{
          position: "absolute",
          top: 11,
          left: "50%",
          transform: "translateX(-50%)",
          width: 114,
          height: 32,
          background: "#000",
          borderRadius: 16,
          zIndex: 4,
        }}
      />

      {/* Status bar (9:41 + signal dots) */}
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 0,
          right: 0,
          padding: "0 30px",
          zIndex: 5,
          fontSize: 14,
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>9:41</span>
        <span style={{ fontSize: 12, letterSpacing: 2 }}>{"●●●●●"}</span>
      </div>

      {/* Mockup contents (absolute-positioned within 320×696) */}
      {children}

      {/* Home indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 6,
          left: "50%",
          transform: "translateX(-50%)",
          width: 134,
          height: 5,
          borderRadius: 3,
          background: "var(--phone-home-indicator, rgba(250,250,250,0.45))",
        }}
      />
    </div>
  );
}
