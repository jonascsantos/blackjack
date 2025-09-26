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
  const { playerHand, dealerHand, phase, hit, stand, roundId } =
    useBlackjackStore();
  const playerScore = React.useMemo(
    () => computeScore(playerHand).total,
    [playerHand]
  );
  const dealerScore = React.useMemo(
    () => computeScore(dealerHand).total,
    [dealerHand]
  );

  return (
    <div className="w-full flex flex-col items-center min-h-screen mobile-safe-area">
      <div className="relative w-full max-w-[1400px] h-[90vh]">
        <div className="absolute inset-0 rounded-[20px] sm:rounded-[40px] lg:rounded-[60px] bg-navy-felt shadow-2xl ring-4 sm:ring-8 lg:ring-12 ring-blue-900/50 p-4 ">
          <div className="grid grid-rows-[100px_1fr_1fr_100px] h-[85vh] gap-6">
            <div className="text-center flex items-center justify-center">
              <div className="text-lg sm:text-xl lg:text-2xl tracking-widest font-bold">
                BLACKJACK
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 sm:gap-6 lg:gap-10 text-sm sm:text-base lg:text-lg ">
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
              <div className="flex w-full justify-center gap-2 sm:gap-3 lg:gap-4 flex-wrap">
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
                  ? dealerHand
                      .slice(2)
                      .map((c, i) => (
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

            <div className="flex flex-col items-center gap-4 sm:gap-6 lg:gap-10">
              <div className="flex gap-2 sm:gap-3 flex-wrap justify-center">
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

            <div className="flex items-center justify-center gap-3 sm:gap-4 lg:gap-6 w-full px-4">
              <div className="gap-4 max-w-sm flex">
                <Button
                  variant="secondary"
                  onClick={hit}
                  disabled={phase !== "playerTurn"}
                  className="flex-1 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-sm sm:text-base lg:text-lg font-semibold touch-target cursor-pointer disabled:cursor-not-allowed"
                >
                  Hit
                </Button>
                <Button
                  variant="secondary"
                  onClick={stand}
                  disabled={phase !== "playerTurn"}
                  className="flex-1 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-sm sm:text-base lg:text-lg font-semibold touch-target cursor-pointer disabled:cursor-not-allowed"
                >
                  Stand
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute inset-2 sm:inset-4 lg:inset-6 rounded-[15px] sm:rounded-[30px] lg:rounded-[50px] ring-2 sm:ring-3 ring-blue-300/40 pointer-events-none"></div>
          <div className="absolute top-2 sm:top-4 lg:top-6 right-2 sm:right-4 lg:right-8 flex flex-col items-center gap-1 sm:gap-2">
            <RulesDialog />
          </div>
        </div>
      </div>
      <ResultOverlay />
    </div>
  );
};

export default BlackjackTable;
