"use client";
import { create } from "zustand";
import { CardRank, Deck, Hand, newDeck } from "@/components/cards";

export type Phase = "idle" | "playerTurn" | "dealerTurn" | "roundOver";

export type BlackjackResult = "playerWin" | "dealerWin" | "push" | null;

export type BlackjackState = {
  deck: Deck;
  playerHand: Hand;
  dealerHand: Hand;
  phase: Phase;
  message: string;
  result: BlackjackResult;
  roundId: number;
};

export type BlackjackActions = {
  shuffle: () => void;
  dealInitial: () => void;
  hit: () => void;
  stand: () => Promise<void>;
  reset: () => void;
  startGame: () => void;
};

export type BlackjackStore = BlackjackState & BlackjackActions;

const LOG_PREFIX = "[Blackjack]";
const log = (...args: unknown[]) => console.log(LOG_PREFIX, ...args);

export const shuffleDeck = (input: Deck): Deck => {
  const deck = [...input];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  log("shuffleDeck", { size: deck.length, top5: deck.slice(0, 5) });
  return deck;
};

export const computeScore = (
  hand: Hand
): { total: number; isSoft: boolean; isBlackjack: boolean } => {
  let total = 0;
  let aces = 0;
  for (const card of hand) {
    if (card.rank === CardRank.Ace) {
      aces += 1;
      total += 11;
    } else if (
      card.rank === CardRank.Ten ||
      card.rank === CardRank.Jack ||
      card.rank === CardRank.Queen ||
      card.rank === CardRank.King
) {
      total += 10;
    } else {
      total += Number(card.rank);
    }
  }
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  const isSoft = aces > 0 && total <= 21;
  const isBlackjack = hand.length === 2 && total === 21;
  log("computeScore", { hand, total, isSoft, isBlackjack });
  return { total, isSoft, isBlackjack };
};

export const useBlackjackStore = create<BlackjackStore>()(
  (set, get) => ({
  deck: [],
  playerHand: [],
  dealerHand: [],
  phase: "idle",
  message: "",
  result: null,
  roundId: 0,

  shuffle: () => {
    log("action: shuffle");
    const deck = shuffleDeck(newDeck());
    set((s) => ({ deck, playerHand: [], dealerHand: [], phase: "idle", message: "", result: null, roundId: s.roundId + 1 }));
  },

  dealInitial: () => {
    const { deck, phase } = get();
    log("action: dealInitial", { phase, deck: deck.length });
    const shuffledDeck = deck.length < 4 ? shuffleDeck(newDeck()) : deck;
    const playerHand: Hand = [shuffledDeck[0], shuffledDeck[2]];
    const dealerHand: Hand = [shuffledDeck[1], shuffledDeck[3]];
    set((s) => ({ deck: shuffledDeck.slice(4), playerHand, dealerHand, phase: "playerTurn", message: "", result: null, roundId: s.roundId + 1 }));
  },

  hit: () => {
    const { deck, playerHand, phase } = get();
    if (phase !== "playerTurn" || deck.length === 0) return;
    const next = deck[0];
    const newHand = [...playerHand, next];
    const remaining = deck.slice(1);
    const { total } = computeScore(newHand);
    if (total > 21) {
      set({ deck: remaining, playerHand: newHand, phase: "roundOver", message: "Player busts", result: "dealerWin" });
      log("hit -> bust", { total });
    } else {
      set({ deck: remaining, playerHand: newHand });
      log("hit -> continue", { total });
    }
  },

  stand: async () => {
    const { deck, dealerHand, playerHand, phase } = get();
    if (phase !== "playerTurn") return;
    set({ phase: "dealerTurn" });
    const playerTotal = computeScore(playerHand).total;
    let currentDealerHand = dealerHand;
    let currentDeck = deck;
    let dealerTotal = computeScore(currentDealerHand).total;
    while (dealerTotal < playerTotal && dealerTotal < 22) {
      await new Promise((r) => setTimeout(r, 800));
      const next = currentDeck[0];
      currentDealerHand = [...currentDealerHand, next];
      currentDeck = currentDeck.slice(1);
      set({ deck: currentDeck, dealerHand: currentDealerHand });
      dealerTotal = computeScore(currentDealerHand).total;
    }
    let message = "Push";
    let result: BlackjackResult = "push";
    if (dealerTotal > 21) {
      message = "Dealer busts • Player wins";
      result = "playerWin";
    } else if (dealerTotal > playerTotal) {
      message = "Dealer wins";
      result = "dealerWin";
    } else if (dealerTotal < playerTotal) {
      message = "Player wins";
      result = "playerWin";
    } else {
      const p = computeScore(playerHand);
      const d = computeScore(dealerHand);
      if (p.isBlackjack && !d.isBlackjack) {
        message = "Player wins • Blackjack";
        result = "playerWin";
      } else if (!p.isBlackjack && d.isBlackjack) {
        message = "Dealer wins • Blackjack";
        result = "dealerWin";
      }
    }
    set({ deck: currentDeck, dealerHand: currentDealerHand, phase: "roundOver", message, result });
  },

  reset: () => {
    const deck = shuffleDeck(newDeck());
    set((s) => ({ deck, playerHand: [], dealerHand: [], phase: "idle", message: "", result: null, roundId: s.roundId + 1 }));
  },

  startGame: () => {
    const deck = shuffleDeck(newDeck());
    const playerHand: Hand = [deck[0], deck[2]];
    const dealerHand: Hand = [deck[1], deck[3]];
    set((s) => ({ deck: deck.slice(4), playerHand, dealerHand, phase: "playerTurn", message: "", result: null, roundId: s.roundId + 1 }));
  },
    })
);

if (typeof window !== "undefined") {
  const STORAGE_KEY = "blackjack-store";
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      useBlackjackStore.setState((current) => ({
        ...current,
        deck: parsed.deck ?? current.deck,
        playerHand: parsed.playerHand ?? current.playerHand,
        dealerHand: parsed.dealerHand ?? current.dealerHand,
        phase: parsed.phase ?? current.phase,
        message: parsed.message ?? current.message,
        result: parsed.result ?? current.result,
        roundId: parsed.roundId ?? current.roundId,
      }));
    }
  } catch {}
  useBlackjackStore.subscribe((state) => {
    try {
      const snapshot = {
        deck: state.deck,
        playerHand: state.playerHand,
        dealerHand: state.dealerHand,
        phase: state.phase,
        message: state.message,
        result: state.result,
        roundId: state.roundId,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch {}
  });
}


