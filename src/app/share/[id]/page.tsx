import { prisma } from "@/lib/prisma";
import { ReceiptView } from "@/components/ReceiptView";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface SharePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  const { id } = await params;
  const sharedLink = await prisma.sharedLink.findUnique({
    where: { id },
    include: { Devotee: true }
  });

  if (!sharedLink) return { title: "Receipt Not Found" };

  return {
    title: `Receipt for ${sharedLink.Devotee.name} | Shree Ked Shaktidham`,
    description: "Official temple offering receipt.",
  };
}

export default async function SharePage({ params }: SharePageProps) {
  const { id } = await params;

  const sharedLink = await prisma.sharedLink.findUnique({
    where: { id },
    include: {
      Donation: {
        include: {
          Devotee: true,
          Invoices: true,
        }
      }
    }
  });

  if (!sharedLink) {
    notFound();
  }

  const donation = sharedLink.Donation;
  const invoices = donation.Invoices;

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4 md:py-20">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center print:hidden">
          <h1 className="font-heading text-3xl text-primary mb-2">Sacred Receipt Portal</h1>
          <p className="text-muted-foreground font-body-md">Official digital receipts from Shree Ked Shaktidham Samity Ked</p>
        </div>

        <ReceiptView donation={donation} invoices={invoices} />
      </div>
    </div>
  );
}
