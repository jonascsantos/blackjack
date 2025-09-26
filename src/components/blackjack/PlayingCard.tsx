"use client";
import React from "react";
import Image from "next/image";
import { Card, CardRank, CardSuit } from "@/components/cards";

export const cardSrc = (suit: CardSuit, rank: CardRank): string => {
  const fileRank = rank === CardRank.Ace ? "1" : rank;
  const suitFile = String(suit).slice(0, -1);
  return `/SVG-cards/png/1x/${suitFile}_${fileRank}.png`;
};

type PlayingCardProps = Card & { className?: string };

const PlayingCard = ({ suit, rank, className }: PlayingCardProps) => (
  <Image
    src={cardSrc(suit, rank)}
    alt={`${rank} of ${suit}`}
    width={80}
    height={120}
    className={className}
    priority
  />
);

export default PlayingCard;
