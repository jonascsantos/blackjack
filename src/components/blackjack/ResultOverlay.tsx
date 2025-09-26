"use client";
import React, { useEffect, useState } from "react";
import { useBlackjackStore, computeScore } from "@/lib/blackjack/store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import confetti from "canvas-confetti";

const ResultOverlay = () => {
  const { phase, message, startGame, result, playerHand, dealerHand } = useBlackjackStore();

  const desiredOpen = phase === "idle" || phase === "roundOver";
  const [open, setOpen] = useState(desiredOpen);
  useEffect(() => {
    if (phase === "roundOver" && desiredOpen) {
      const t = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(t);
    }
    setOpen(desiredOpen);
  }, [desiredOpen, phase]);

  type Result = "playerWin" | "dealerWin" | "push";

  const RESULT_TO_HEADLINE: Record<Result, string> = {
    playerWin: "YOU WIN",
    dealerWin: "YOU LOSE",
    push: "PUSH",
  };

  const headline =
    phase === "idle" ? "Ready to play?" : RESULT_TO_HEADLINE[result as Result];

  const RESULT_TO_COLOR: Record<Result, string> = {
    playerWin: "text-emerald-400",
    dealerWin: "text-[var(--brand-pink-500)]",
    push: "text-zinc-400",
  };
  const colorClass =
    phase === "idle"
      ? "text-[var(--brand-pink-500)]"
      : RESULT_TO_COLOR[result as Result];

  useEffect(() => {
    if (phase === "roundOver" && result === "playerWin") {
      const startDelayMs = 1200;
      const startTimer = setTimeout(() => {
        const end = Date.now() + 3 * 1000;
        const colors = ["#a786ff", "#fd8bbc", "#141449", "#e12a54"];
        const frame = () => {
          if (Date.now() > end) return;
          confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            startVelocity: 60,
            origin: { x: 0, y: 0.5 },
            colors,
          });
          confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            startVelocity: 60,
            origin: { x: 1, y: 0.5 },
            colors,
          });
          requestAnimationFrame(frame);
        };
        frame();
      }, startDelayMs);
      return () => clearTimeout(startTimer);
    }
  }, [phase, result]);

  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-lg text-center min-h-56"
      >
        <DialogHeader>
          <DialogTitle
            className={`text-center text-5xl font-extrabold tracking-wide ${colorClass}`}
          >
            {headline}
          </DialogTitle>
          {phase === "roundOver" ? (
            <DialogDescription className="opacity-90 text-center space-y-2 gap-3 flex flex-col items-center">
              <div className="text-lg font-semibold">{message}</div>
              <span className="text-base opacity-80 text-center">
                Player: {computeScore(playerHand).total} • Dealer:{" "}
                {computeScore(dealerHand).total}
              </span>
            </DialogDescription>
          ) : null}
        </DialogHeader>
        <div className="mt-4 flex items-center justify-center gap-4">
          <Button variant="default" onClick={startGame} className="px-8 py-4 text-lg font-semibold">
            {phase === "idle" ? "Start game" : "Play again"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResultOverlay;
