import { Invoice } from "@/types/invoice";
import InvoiceItemsTable from "./InvoiceItemsTable";
import InvoiceNotes from "./InvoiceNotes";

interface InvoiceCardPanelProps {
  invoice: Invoice;
}

export default function InvoiceCardPanel({
  invoice,
}: InvoiceCardPanelProps) {


  return (
    <>
      <InvoiceItemsTable invoice={invoice} />
      <InvoiceNotes invoice={invoice} />
    </>
  );
}
