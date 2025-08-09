"use client";

import { Accordion } from "@mantine/core";
import { Invoice } from "@/types/invoice";

import InvoiceCardHeader from "./InvoiceCardHeader";
import InvoiceCardPanel from "./InvoiceCardPanel";

interface InvoiceCardProps {
  invoice: Invoice;
}

export default function InvoiceCard({ invoice: initialInvoice }: InvoiceCardProps) {
  return (
    <Accordion variant="contained">
      <Accordion.Item value={initialInvoice.invoiceNumber}>
        <Accordion.Control>
          <InvoiceCardHeader invoice={initialInvoice} />
        </Accordion.Control>
        <Accordion.Panel>
          <InvoiceCardPanel
            invoice={initialInvoice}
          />
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

