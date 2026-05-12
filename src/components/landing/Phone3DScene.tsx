"use client";

/**
 * Phone3DScene — CSS3D phone showcase.
 *
 * Pivoted away from WebGL. Reasons:
 *   - drei <Html transform>'s pixel/world scale is fragile across
 *     viewport sizes and drei versions; getting the embedded mockup
 *     to render at the right size took multiple rounds and would
 *     break again on viewport resize.
 *   - The existing PhoneFrame component is pixel-perfect and renders
 *     the mockups at their native authored dimensions. CSS3D wraps it
 *     in real perspective transforms — visually indistinguishable
 *     from WebGL for a flat phone subject, but reliable.
 *
 * Visual recipe:
 *   - A `perspective` container creates the 3D scene depth.
 *   - A motion.div wraps PhoneFrame, with `transformStyle: preserve-3d`
 *     and rotateX/rotateY/translateX/Y/Z driven by the parent-supplied
 *     pose plus an optional gentle idle drift.
 *   - A drop-shadow filter adds a soft emerald-tinted ambient glow
 *     under the phone, in keeping with the fintech palette.
 *
 * The `pose` prop API matches what the WebGL version exposed so the
 * Hero / future ScrollShowcase consumers don't need to change their
 * call sites: position is in CSS pixels, rotation in radians.
 */

import { ComponentType, ReactNode, useEffect, useRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import { PhoneFrame, PHONE_FRAME_WIDTH, PHONE_FRAME_HEIGHT } from "./PhoneFrame";

export interface PhonePose {
  /** [x, y, z] translation in CSS pixels. */
  position: [number, number, number];
  /** [rotateX, rotateY, rotateZ] in radians. */
  rotation: [number, number, number];
  /** Uniform scale multiplier. */
  scale: number;
}

interface Phone3DSceneProps {
  /** Pass either a Mockup component (simple case) or children (for AnimatePresence-wrapped mockups). */
  Mockup?: ComponentType;
  children?: ReactNode;
  pose: PhonePose;
  /** Adds a continuous gentle drift so the phone feels alive at rest. */
  idleRotation?: boolean;
  ariaLabel?: string;
  className?: string;
  /** Force-dark skin even in light mode. Useful when the ambient bg is dark. */
  forceDark?: boolean;
}

const RAD_TO_DEG = 180 / Math.PI;

export default function Phone3DScene({
  Mockup,
  children,
  pose,
  idleRotation = false,
  ariaLabel,
  className,
  forceDark = false,
}: Phone3DSceneProps) {
  // Motion values that we lerp toward `pose` each frame. Driving the
  // CSS transform via motion values means React doesn't re-render the
  // tree on every mouse-move — Framer Motion writes directly to the
  // DOM transform.
  const x = useMotionValue(pose.position[0]);
  const y = useMotionValue(pose.position[1]);
  const z = useMotionValue(pose.position[2]);
  const rx = useMotionValue(pose.rotation[0] * RAD_TO_DEG);
  const ry = useMotionValue(pose.rotation[1] * RAD_TO_DEG);
  const rz = useMotionValue(pose.rotation[2] * RAD_TO_DEG);
  const sc = useMotionValue(pose.scale);

  useEffect(() => {
    let rafId = 0;
    let start = 0;

    const tick = (time: number) => {
      if (!start) start = time;
      const t = (time - start) / 1000;

      const idleX = idleRotation ? Math.sin(t * 0.4) * 0.025 : 0;
      const idleY = idleRotation ? Math.sin(t * 0.5) * 0.05 : 0;

      const targetX = pose.position[0];
      const targetY = pose.position[1];
      const targetZ = pose.position[2];
      const targetRX = (pose.rotation[0] + idleX) * RAD_TO_DEG;
      const targetRY = (pose.rotation[1] + idleY) * RAD_TO_DEG;
      const targetRZ = pose.rotation[2] * RAD_TO_DEG;
      const targetSC = pose.scale;

      const k = 0.12; // lerp factor — higher = snappier
      x.set(x.get() + (targetX - x.get()) * k);
      y.set(y.get() + (targetY - y.get()) * k);
      z.set(z.get() + (targetZ - z.get()) * k);
      rx.set(rx.get() + (targetRX - rx.get()) * k);
      ry.set(ry.get() + (targetRY - ry.get()) * k);
      rz.set(rz.get() + (targetRZ - rz.get()) * k);
      sc.set(sc.get() + (targetSC - sc.get()) * k);

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [pose, idleRotation, x, y, z, rx, ry, rz, sc]);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(1);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const update = () => {
      const available = el.clientHeight;
      const needed = PHONE_FRAME_HEIGHT * pose.scale;
      setFitScale(available < needed ? available / needed : 1);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [pose.scale]);

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{
        perspective: "1600px",
        perspectiveOrigin: "center center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          transform: fitScale < 1 ? `scale(${fitScale})` : undefined,
          transformStyle: "preserve-3d",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.div
          style={{
            width: PHONE_FRAME_WIDTH,
            height: PHONE_FRAME_HEIGHT,
            transformStyle: "preserve-3d",
            x,
            y,
            z,
            rotateX: rx,
            rotateY: ry,
            rotateZ: rz,
            scale: sc,
            willChange: "transform",
            filter:
              "drop-shadow(0 30px 60px rgba(17, 166, 117, 0.28)) drop-shadow(0 12px 24px rgba(15, 17, 23, 0.35))",
          }}
        >
          <PhoneFrame ariaLabel={ariaLabel} forceDark={forceDark}>
            {children ?? (Mockup ? <Mockup /> : null)}
          </PhoneFrame>
        </motion.div>
      </div>
    </div>
  );
}
