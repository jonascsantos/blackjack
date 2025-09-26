"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";

const RulesDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="px-2 py-1 sm:px-4 sm:py-2 lg:px-6 lg:py-3 text-xs sm:text-sm lg:text-lg font-semibold cursor-pointer">
          <Info className="h-3 w-3 sm:h-4 sm:w-4 lg:h-6 lg:w-6" />
          <span className="hidden sm:inline">Rules</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold">Rules</DialogTitle>
          <DialogDescription className="text-sm sm:text-lg">Read before you play</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 sm:space-y-4 text-sm sm:text-base">
          <ul className="list-disc pl-5 space-y-1">
            <li>The game is played with a deck of 52 cards</li>
            <li>Prior to starting the game the cards must be shuffled</li>
            <li>
              The dealer will give two cards to the player and two cards to themself. One of the dealer cards is dealt face up. The facedown card is called the &quot;hole card.&quot;
            </li>
            <li>
              Play begins with the player. The following choices available to the player:
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>&quot;Stand&quot;: Player stays put with their cards.</li>
                <li>&quot;Hit&quot;: Player draws another card. If this card causes the player&apos;s total points to exceed 21 (&quot;bust&quot;) then they will lose.</li>
              </ul>
            </li>
            <li>After the player has had their turn, the dealer will turn over the hole card.</li>
            <li>If the dealer has a lower score than the player the dealer will draw more cards until they either win, bust or draw</li>
          </ul>

          <div className="font-bold text-base sm:text-lg">Result</div>
          <ul className="list-disc pl-5 space-y-1 sm:space-y-2">
            <li>If the player or the dealer busts then they will lose.</li>
            <li>If no player has bust then the higher point total will win.</li>
            <li>If both players have the same score the result is a draw unless one player has blackjack in which case they win.</li>
          </ul>

          <div className="font-bold text-base sm:text-lg">Scoring</div>
          <ul className="list-disc pl-5 space-y-1 sm:space-y-2">
            <li>Aces may be counted as 1 or 11 points. The higher value applies if it does not cause the player to bust</li>
            <li>Cards 2 to 9 points are same as face value (e.g 5 = 5 points)</li>
            <li>Tens and face cards count as ten points.</li>
            <li>The value of a hand is the sum of the point values of the individual cards. Except, a &quot;blackjack&quot; is the highest hand, consisting of one ace and any 10-point card, and it outranks all other 21-point hands.</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RulesDialog;


