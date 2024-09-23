import React from 'react';
import { Card } from "@repo/ui/card";

const getUserName = (userId:number) => {
  switch (userId) {
    case 1:
      return "Alice";
    case 2:
      return "Bob";
    default:
      return `User ${userId}`;
  }
};

export const P2PTransactions = ({
  transactions
}: {
  transactions: {
    time: Date,
    amount: number,
    type: string,
    userId: number
  }[]
}) => {
  if (!transactions.length) {
    return (
      <Card title="Recent Transactions">
        <div className="text-center pb-8 pt-8">
          No Recent transactions
        </div>
      </Card>
    );
  }

  return (
    <Card title="Recent Transactions">
      <div className="pt-2">
        {transactions.map((t, index) => (
          <div key={index} className="flex justify-between">
            <div>
              <div className="text-sm">
                {t.type === "DEBIT" 
                  ? `Sent to ${getUserName(t.userId)}` 
                  : `Received from ${getUserName(t.userId)}`}
              </div>
              <div className="text-slate-600 text-xs">
                {t.time.toDateString()}
              </div>
            </div>
            <div className={`flex flex-col justify-center ${t.type === "DEBIT" ? "text-red-600" : "text-green-600"}`}>
              {t.type === "DEBIT" ? "- " : ""}Rs {t.amount / 100}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};