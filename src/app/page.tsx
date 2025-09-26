import BlackjackTable from "@/components/blackjack/Table";

export default async function Home() {
  return (
    <div className="font-sans items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div className="h-full w-full">
        <BlackjackTable />
      </div>
    </div>
  );
}
