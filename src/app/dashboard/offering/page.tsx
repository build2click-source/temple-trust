import NewOfferingForm from "./NewOfferingForm";

export default function OfferingPage() {
  return (
    <>
      <div className="mb-10">
        <h1 className="font-heading text-4xl text-primary mb-2">Record New Offering</h1>
        <p className="font-body-md text-muted-foreground max-w-2xl">
          Enter devotee details and contribution amount to generate sacred receipts and update the divine ledger.
        </p>
      </div>

      <NewOfferingForm />
    </>
  );
}
