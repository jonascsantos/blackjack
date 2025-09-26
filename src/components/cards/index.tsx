"use client";
import Image from "next/image";
import React from "react";

export enum CardSuit {
  Clubs = "clubs",
  Diamonds = "diamonds",
  Hearts = "hearts",
  Spades = "spades",
}

export enum CardRank {
  Ace = "ace",
  Two = "2",
  Three = "3",
  Four = "4",
  Five = "5",
  Six = "6",
  Seven = "7",
  Eight = "8",
  Nine = "9",
  Ten = "10",
  Jack = "jack",
  Queen = "queen",
  King = "king",
}

export type Card = {
  suit: CardSuit;
  rank: CardRank;
};

export type Deck = Array<Card>;
export type Hand = Array<Card>;
export type GameState = { deck: Deck; hand: Hand };

//UI Elements
export const CardBackImage = () => <Image fill src={`/SVG-cards/png/1x/back.png`} alt="Card back" />;

export const CardImage = ({ suit, rank }: Card) => {
  const card = rank === CardRank.Ace ? 1 : rank;
  return <Image fill sizes="100%" src={`/SVG-cards/png/1x/${suit.slice(0, -1)}_${card}.png`} alt={`${rank} of ${suit}`} />;
};

//Setup
export const newDeck = (): Deck =>
  Object.values(CardSuit)
    .map((suit) =>
      Object.values(CardRank).map((rank) => ({
        suit,
        rank,
      }))
    )
    .reduce((a, v) => [...a, ...v]);

export const initialState: GameState = {
  deck: newDeck(),
  hand: [],
};


//Actions
export const dealCardToHand = (state: GameState): GameState => {
  const [card, ...remaining] = state.deck;
  return { ...state, deck: remaining, hand: [...state.hand, card] };
};