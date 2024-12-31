import { getCustomer } from "@/lib/queries/getCustomer";
import { BackButton } from "@/components/BackButton";

import React from "react";

async function CustomerFormPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  try {
    const { customerId } = await searchParams;

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

      console.log(customer);
    } else {
    }
  } catch (e) {
    if (e instanceof Error) {
      throw e;
    }
  }
}

export default CustomerFormPage;
