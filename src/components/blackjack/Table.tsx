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
      <div className="relative w-full max-w-[1100px] h-[80vh]">
        <div className="absolute inset-0 rounded-[48px] bg-navy-felt shadow-2xl ring-8 ring-blue-900/50 p-22">
          <div className="absolute inset-4 rounded-[40px] ring-2 ring-blue-300/40"></div>

          <div className="flex flex-col items-between justify-between h-full">
            <div className="absolute top-8 left-0 right-0 text-center">
              <div className="text-sm tracking-widest">
                BLACKJACK
              </div>
            </div>

            <div className="flex flex-col items-center gap-2  text-xs">
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
              <div>Dealer • Score</div>
              <div className="flex w-full justify-center gap-2">
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

            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-1">
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
              <div className="text-xs opacity-80">Player • Score</div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
              <Button
                variant="secondary"
                onClick={hit}
                disabled={phase !== "playerTurn"}
              >
                Hit
              </Button>
              <Button
                variant="secondary"
                onClick={stand}
                disabled={phase !== "playerTurn"}
              >
                Stand
              </Button>
            </div>
            <div className="absolute top-6 right-8 flex flex-col items-center gap-2">
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
