/**
 * Motion's full feature set (animations, exit animations, layout and shared-layout animation), loaded on
 * demand by <LazyMotion>. Components that use `m.*` inside it start with a small core and pick these up
 * after the page is interactive, so they stay out of the first JavaScript the browser has to run.
 */
import { domMax } from "motion/react";

export default domMax;
