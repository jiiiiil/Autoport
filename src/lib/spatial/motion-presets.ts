export interface MotionTransformConfig {
  x?: string | number;
  y?: string | number;
  z?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  scale?: number;
  opacity?: number;
  duration?: number;
  ease?: string;
}

export const SPATIAL_MOTION_PRESETS: Record<string, { start: MotionTransformConfig; end: MotionTransformConfig }> = {
  heroFloat: {
    start: { y: 0, rotateZ: -2, scale: 1 },
    end: { y: -60, rotateZ: 4, scale: 0.95 },
  },
  slowParallax: {
    start: { y: 0, opacity: 0.8 },
    end: { y: -120, opacity: 1 },
  },
  enterLeft: {
    start: { x: "-40vw", rotateY: -25, opacity: 0 },
    end: { x: "0vw", rotateY: 0, opacity: 1 },
  },
  enterRight: {
    start: { x: "40vw", rotateY: 25, opacity: 0 },
    end: { x: "0vw", rotateY: 0, opacity: 1 },
  },
  horizontalTravel: {
    start: { x: "-20vw", rotateZ: -6 },
    end: { x: "20vw", rotateZ: 8 },
  },
  verticalTravel: {
    start: { y: "20vh", scale: 0.8 },
    end: { y: "-20vh", scale: 1.1 },
  },
  depthPush: {
    start: { scale: 0.6, opacity: 0.3, z: -200 },
    end: { scale: 1.1, opacity: 1, z: 0 },
  },
  scaleThrough: {
    start: { scale: 0.8, rotateZ: -5 },
    end: { scale: 1.2, rotateZ: 5 },
  },
};
