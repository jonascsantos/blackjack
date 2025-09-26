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
    <div className="flex flex-col items-center gap-1 text-center">
      <div className="relative inline-block">
        <div className="h-10 w-10 rounded-full bg-[var(--background)] ring-2 ring-yellow-400 overflow-hidden">
          <Avatar>
            <AvatarImage
              className="h-full w-full p-1"
              src={seat.avatar}
              alt={seat.name}
            />
            <AvatarFallback className="text-white text-xs">
              {seat.name?.charAt(0) ?? "?"}
            </AvatarFallback>
          </Avatar>
        </div>
        {badge !== undefined ? (
          <div className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-[var(--primary)] text-[10px] font-semibold text-white grid place-items-center ring-1 ring-white/20">
            {badge}
          </div>
        ) : null}
      </div>
      <div className="text-xs opacity-90">{seat.name}</div>
    </div>
  );
};

export default SeatView;
