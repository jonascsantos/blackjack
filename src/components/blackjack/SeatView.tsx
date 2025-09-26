"use client";
import React from "react";
import { AvatarFallback, AvatarImage, Avatar } from "@radix-ui/react-avatar";

export type Seat = {
  id: number;
  name: string;
  avatar: string;
};

type Props = {
  seat: Seat;
  badge?: React.ReactNode;
};

const SeatView = ({ seat, badge }: Props) => {
  return (
    <div className="flex flex-col items-center gap-1 sm:gap-2 text-center">
      <div className="relative inline-block">
        <div className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 rounded-full bg-[var(--background)] ring-2 sm:ring-3 ring-yellow-400 overflow-hidden">
          <Avatar>
            <AvatarImage
              className="h-full w-full p-1 sm:p-2"
              src={seat.avatar}
              alt={seat.name}
            />
            <AvatarFallback className="text-white text-sm sm:text-base lg:text-lg font-semibold">
              {seat.name?.charAt(0) ?? "?"}
            </AvatarFallback>
          </Avatar>
        </div>
        {badge !== undefined ? (
          <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 min-w-6 h-6 sm:min-w-7 sm:h-7 px-1 sm:px-2 rounded-full bg-[var(--primary)] text-xs sm:text-sm font-bold text-white grid place-items-center ring-1 sm:ring-2 ring-white/20">
            {badge}
          </div>
        ) : null}
      </div>
      <div className="text-sm sm:text-base lg:text-lg font-semibold opacity-90">{seat.name}</div>
    </div>
  );
};

export default SeatView;
