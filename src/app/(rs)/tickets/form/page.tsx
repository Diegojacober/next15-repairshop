import { getTicket } from "@/lib/queries/getTicket";
import { BackButton } from "@/components/BackButton";
import TicketForm from "@/app/(rs)/tickets/form/TicketForm";

import { getCustomer } from "@/lib/queries/getCustomer";

async function TicketFormPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  try {
    const { ticketId, customerId } = await searchParams;

    if (!ticketId && !customerId) {
      return (
        <>
          <h2 className="text-2xl mb-2">
            Ticket ID #{ticketId} or Customer ID required to load ticket form
            <BackButton title="Go Back" variant={"default"} />
          </h2>
        </>
      );
    }

    if (customerId) {
      const customer = await getCustomer(parseInt(customerId));

      if (!customer) {
        return (
          <>
            <h2 className="text-2xl mb-2">
              Customer ID #{customerId} not found
              <BackButton title="Go Back" variant={"default"} />
            </h2>
          </>
        );
      }

      if (!customer.active) {
        return (
          <>
            <h2 className="text-2xl mb-2">
              Customer ID #{customerId} is not active
              <BackButton title="Go Back" variant={"default"} />
            </h2>
          </>
        );
      }

      // return ticket form
      console.log(customer);
      return <TicketForm customer={customer} />;
    }

    if (ticketId) {
      const ticket = await getTicket(parseInt(ticketId));

      if (!ticket) {
        return (
          <>
            <h2 className="text-2xl mb-2">
              Ticket ID #{ticketId} not found
              <BackButton title="Go Back" variant={"default"} />
            </h2>
          </>
        );
      }

      const customer = await getCustomer(ticket.customerId);
      console.log("ticket: ", ticket);
      console.log("customer: ", customer);

      return <TicketForm customer={customer} ticket={ticket} />;
    }
  } catch (e) {
    if (e instanceof Error) {
      throw e;
    }
  }
}

export default TicketFormPage;
