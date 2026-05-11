"use client";

/**
 * Phone3DSceneLoader — dynamic-imports Phone3DScene with ssr: false so
 * Three.js doesn't try to render during Next.js static export.
 *
 * Use this anywhere you'd otherwise import Phone3DScene directly. The
 * loader returns a transparent placeholder during hydration, then swaps
 * to the live Canvas.
 */

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type Phone3DScene from "./Phone3DScene";

const Phone3DSceneClient = dynamic(() => import("./Phone3DScene"), {
  ssr: false,
  loading: () => <div style={{ width: "100%", height: "100%" }} />,
});

export default function Phone3DSceneLoader(
  props: ComponentProps<typeof Phone3DScene>,
) {
  return <Phone3DSceneClient {...props} />;
}
