"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import type { ShopImage } from "@/lib/shop/data";
import { Icon } from "./ui/Icon";

/**
 * Product gallery: one large image with a strip of thumbnails. Choosing a thumbnail crossfades the large
 * image; Previous and Next buttons sit on the large image, the arrow keys step through it, and on touch
 * screens it can also be swiped. Thumbnails are real buttons, so the gallery works from the keyboard, and
 * the first image is in the server HTML.
 */
/** `transitionName` (product page only) lets the image travel from the product card during a page transition. */
export function ProductGallery({ images, title, transitionName }: { images: ShopImage[]; title: string; transitionName?: string }) {
  const [index, setIndex] = useState(0);
  if (!images.length) return null;
  const current = images[Math.min(index, images.length - 1)];
  const go = (i: number) => setIndex((i + images.length) % images.length);

  return (
    <MotionConfig reducedMotion="user">
      <div
        className="pdp__gallery"
        onKeyDown={(e) => {
          if (images.length < 2) return;
          if (e.key === "ArrowRight") go(index + 1);
          else if (e.key === "ArrowLeft") go(index - 1);
        }}
      >
        <motion.div
          className="pdp__main"
          style={transitionName && index === 0 ? { viewTransitionName: transitionName } : undefined}
          drag={images.length > 1 ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          dragSnapToOrigin
          onDragEnd={(_, info) => {
            if (info.offset.x < -60) go(index + 1);
            else if (info.offset.x > 60) go(index - 1);
          }}
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={current.src}
              className="pdp__frame"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src={current.src}
                alt={index === 0 ? title : `${title}, image ${index + 1} of ${images.length}`}
                width={current.width}
                height={current.height}
                sizes="(min-width: 64rem) 50vw, 100vw"
                priority={index === 0}
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
          {images.length > 1 ? (
            <>
              <button type="button" className="pdp__step pdp__step--prev glass" aria-label="Previous image" onPointerDown={(e) => e.stopPropagation()} onClick={() => go(index - 1)}>
                <Icon name="arrow" />
              </button>
              <button type="button" className="pdp__step glass" aria-label="Next image" onPointerDown={(e) => e.stopPropagation()} onClick={() => go(index + 1)}>
                <Icon name="arrow" />
              </button>
              <p className="pdp__count" aria-hidden="true">
                {index + 1} / {images.length}
              </p>
            </>
          ) : null}
        </motion.div>

        {images.length > 1 ? (
          <ul className="pdp__thumbs" role="list" aria-label="Product images">
            {images.map((img, i) => (
              <li key={img.src}>
                <button type="button" className="pdp__thumb" aria-current={i === index} aria-label={`Show image ${i + 1} of ${images.length}`} onClick={() => setIndex(i)}>
                  <Image src={img.src} alt="" width={160} height={160} sizes="80px" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </MotionConfig>
  );
}
