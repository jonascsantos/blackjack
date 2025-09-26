"use client";
import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Card } from "@/components/cards";

type Props = {
  faceDownSrc?: string;
  showFaceDown: boolean;
  card: Card;
  uniqueKey: string | number;
};

const HoleCardFlip = ({
  faceDownSrc = "/SVG-cards/png/1x/back-maroon.png",
  showFaceDown,
  card,
  uniqueKey,
}: Props) => {
  return (
    <motion.div
      key={uniqueKey}
      className="w-20 h-30 sm:w-20 sm:h-30 lg:w-24 lg:h-36"
      style={{
        position: "relative",
        transformStyle: "preserve-3d",
        perspective: 800,
      }}
      transition={{ duration: 0.7 }}
      animate={{ rotateY: showFaceDown ? 0 : 180 }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backfaceVisibility: "hidden",
          transform: "rotateY(0deg)",
        }}
      >
        <Image
          src={faceDownSrc}
          alt="back"
          fill
          sizes="100%"
          className="rounded"
        />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
        }}
      >
        <Image
          src={`/SVG-cards/png/1x/${String(card.suit).slice(0, -1)}_${
            card.rank === "ace" ? 1 : card.rank
          }.png`}
          alt={`${card.rank} of ${card.suit}`}
          fill
          sizes="100%"
          className="rounded"
        />
      </div>
    </motion.div>
  );
};

export default HoleCardFlip;
