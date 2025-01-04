import React from "react";
import TicketSearch from "./TicketSearch";
import { getTicketSearchResults } from "@/lib/queries/getTicketSearchResults";
import { getOpenTickets } from "@/lib/queries/getOpenTickets";
import TicketTable from "@/app/(rs)/tickets/TicketTable";

export const metadata = {
  title: "Tickets Search",
};

async function Tickets({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { searchText } = await searchParams;

  if (!searchText) {
    const results = await getOpenTickets();

    return (
      <>
        <TicketSearch />
        {results.length ? (
          <TicketTable data={results} />
        ) : (
          <p className="mt-4">No open tickets found</p>
        )}
      </>
    );
  }

  const results = await getTicketSearchResults(searchText);

  return (
    <>
      <TicketSearch />
      {results.length ? (
        <TicketTable data={results} />
      ) : (
        <p className="mt-4">No results found</p>
      )}
    </>
  );
}

export default Tickets;
