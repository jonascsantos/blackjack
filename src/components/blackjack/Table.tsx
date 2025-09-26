"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { CardRank, CardSuit } from "@/components/cards";
import { useBlackjackStore, computeScore } from "@/lib/blackjack/store";
import SeatView, { Seat } from "@/components/blackjack/SeatView";
import ResultOverlay from "@/components/blackjack/ResultOverlay";
import RulesDialog from "@/components/blackjack/RulesDialog";
import HoleCardFlip from "@/components/blackjack/HoleCardFlip";

type PlayerSeat = Seat & { cards?: Array<{ suit: CardSuit; rank: CardRank }> };

const playerSeat: PlayerSeat = {
  id: 1,
  name: "You",
  avatar: "/poker-clubs.svg",
  cards: [
    { suit: CardSuit.Clubs, rank: CardRank.Eight },
    { suit: CardSuit.Diamonds, rank: CardRank.Six },
  ],
};

const dealerSeat: Seat = {
  id: 0,
  name: "Dealer",
  avatar: "/penfold-logo.png",
};

const BlackjackTable = () => {
  const {
    playerHand,
    dealerHand,
    phase,
    hit,
    stand,
    roundId,
  } = useBlackjackStore();
  const playerScore = React.useMemo(() => computeScore(playerHand).total, [playerHand]);
  const dealerScore = React.useMemo(() => computeScore(dealerHand).total, [dealerHand]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full max-w-[1400px] h-[90vh]">
        <div className="absolute inset-0 rounded-[60px] bg-navy-felt shadow-2xl ring-12 ring-blue-900/50 p-32">
          <div className="absolute inset-6 rounded-[50px] ring-3 ring-blue-300/40"></div>

          <div className="flex flex-col items-between justify-between h-full">
            <div className="absolute top-12 left-0 right-0 text-center">
              <div className="text-2xl tracking-widest font-bold">
                BLACKJACK
              </div>
            </div>

            <div className="flex flex-col items-center gap-16  text-lg">
                <SeatView
                  seat={dealerSeat}
                  badge={
                    dealerHand.length
                      ? phase === "playerTurn"
                        ? "--"
                        : dealerScore
                      : "--"
                  }
                />
              <div className="flex w-full justify-center gap-4">
                {phase !== "idle" && dealerHand[0] ? (
                  <HoleCardFlip
                    faceDownSrc="/SVG-cards/png/1x/back-maroon.png"
                    showFaceDown={false}
                    card={dealerHand[0]}
                    uniqueKey={`dealer-first-${roundId}`}
                  />
                ) : null}
                {phase !== "idle" && dealerHand[1] ? (
                  <HoleCardFlip
                    faceDownSrc="/SVG-cards/png/1x/back-maroon.png"
                    showFaceDown={phase === "playerTurn"}
                    card={dealerHand[1]}
                    uniqueKey={`hole-${roundId}`}
                  />
                ) : null}
                {phase !== "playerTurn" && dealerHand.length > 2
                  ? dealerHand.slice(2).map((c, i) => (
                      <HoleCardFlip
                        key={`dealer-extra-${roundId}-${i}`}
                        faceDownSrc="/SVG-cards/png/1x/back-maroon.png"
                        showFaceDown={false}
                        card={c}
                        uniqueKey={`dealer-extra-${roundId}-${i}`}
                      />
                    ))
                  : null}
              </div>
              
            </div>

            <div className="flex flex-col items-center gap-18">
              <div className="flex gap-3">
                {playerHand.map((c, i) => (
                  <HoleCardFlip
                    key={`player-${roundId}-${i}`}
                    faceDownSrc="/SVG-cards/png/1x/back-maroon.png"
                    showFaceDown={false}
                    card={c}
                    uniqueKey={`player-${roundId}-${i}`}
                  />
                ))}
              </div>
              <SeatView
                seat={playerSeat}
                badge={playerHand.length ? playerScore : "--"}
              />
            </div>

            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-6">
              <Button
                variant="secondary"
                onClick={hit}
                disabled={phase !== "playerTurn"}
                className="px-8 py-4 text-lg font-semibold"
              >
                Hit
              </Button>
              <Button
                variant="secondary"
                onClick={stand}
                disabled={phase !== "playerTurn"}
                className="px-8 py-4 text-lg font-semibold"
              >
                Stand
              </Button>
            </div>
            <div className="absolute top-8 right-12 flex flex-col items-center gap-3">
              <RulesDialog />
            </div>
          </div>

        </div>
      </div>
      <ResultOverlay />
    </div>
  );
};

export default BlackjackTable;
