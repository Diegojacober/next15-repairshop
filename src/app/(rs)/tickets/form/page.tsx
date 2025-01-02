import { getTicket } from "@/lib/queries/getTicket";
import { BackButton } from "@/components/BackButton";
import TicketForm from "@/app/(rs)/tickets/form/TicketForm";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getCustomer } from "@/lib/queries/getCustomer";
import { Users, init as kindeInit } from "@kinde/management-api-js";

export async function geneareteMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { ticketId, customerId } = await searchParams;

  if (!ticketId && !customerId)
    return { title: "Missing Ticket ID or Ticket ID" };

  if (customerId) return { title: `New ticket for customer #${customerId}` };

  return { title: `Edit Ticket #${ticketId}` };
}

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

    const { getPermission, getUser } = getKindeServerSession();
    const [managerPermission, user] = await Promise.all([
      getPermission("manager"),
      getUser(),
    ]);
    const isManager = managerPermission?.isGranted;

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
      if (isManager) {
        kindeInit(); // Initializes the Kinde management API
        const { users } = await Users.getUsers();

        const techs = users
          ? users.map((user) => ({ id: user.email!, description: user.email! }))
          : [];

        return <TicketForm customer={customer} techs={techs} />;
      } else {
        return <TicketForm customer={customer} />;
      }
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

      if (isManager) {
        kindeInit(); // Initializes the Kinde management API
        const { users } = await Users.getUsers();

        const techs = users
          ? users.map((user) => ({ id: user.email!, description: user.email! }))
          : [];

        return <TicketForm customer={customer} ticket={ticket} techs={techs} />;
      } else {
        const isEditable =
          user.email?.toLowerCase() === ticket.tech.toLowerCase();
        return (
          <TicketForm
            customer={customer}
            ticket={ticket}
            isEditable={isEditable}
          />
        );
      }
    }
  } catch (e) {
    if (e instanceof Error) {
      throw e;
    }
  }
}

export default TicketFormPage;
