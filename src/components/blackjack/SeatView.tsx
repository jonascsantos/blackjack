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
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="relative inline-block">
        <div className="h-16 w-16 rounded-full bg-[var(--background)] ring-3 ring-yellow-400 overflow-hidden">
          <Avatar>
            <AvatarImage
              className="h-full w-full p-2"
              src={seat.avatar}
              alt={seat.name}
            />
            <AvatarFallback className="text-white text-lg font-semibold">
              {seat.name?.charAt(0) ?? "?"}
            </AvatarFallback>
          </Avatar>
        </div>
        {badge !== undefined ? (
          <div className="absolute -top-2 -right-2 min-w-7 h-7 px-2 rounded-full bg-[var(--primary)] text-sm font-bold text-white grid place-items-center ring-2 ring-white/20">
            {badge}
          </div>
        ) : null}
      </div>
      <div className="text-lg font-semibold opacity-90">{seat.name}</div>
    </div>
  );
};

export default SeatView;
