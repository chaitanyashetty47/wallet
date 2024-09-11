import { getServerSession } from "next-auth";
import { SendCard } from "../../../components/SendCard";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import { P2PTransactions } from "../../../components/P2PTransactions";

async function getP2PTransactions() : Promise<({
    time: Date;
    amount: number;
    type: string;
    userId: number;
} )[]> {
  const session = await getServerSession(authOptions);
  const txns = await prisma.p2pTransfer.findMany({
    where: {
      OR: [
        {
          fromUserId: Number(session?.user?.id)
        },
        {
          toUserId: Number(session?.user?.id)
        }
      ]
    }
  });
  
  return txns.map(t => {
    if (t.fromUserId == session?.user?.id) {
      return (
        {
          time: new Date(t.timestamp),
          amount: t.amount,
          type: "DEBIT",
          userId: t.toUserId,
        }
      )
    } else if (t.toUserId == session?.user?.id) {
      return (
        {
          time: new Date(t.timestamp),
          amount: t.amount,
          type: "CREDIT",
          userId: t.fromUserId
        }
      )
    }
    return null; // Add this line
  }).filter((t): t is NonNullable<typeof t> => t !== null); // Add this line
}

export default async function () {

  const transactions = await getP2PTransactions();

  return <div className="w-screen">
    <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
      P2P Transfer
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      <div>
        <SendCard />
      </div>
        <P2PTransactions transactions={transactions} />
      

    </div>
  </div>
}