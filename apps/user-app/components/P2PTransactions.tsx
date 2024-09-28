"use client"
import React, { useEffect, useState } from 'react';
import { Card } from "@repo/ui/card";

const P2PTransactions = ({
  transactions
}: {
  transactions: {
    time: Date,
    amount: number,
    type: string,
    userId: number
  }[]
}) => {
  const [users, setUsers] = useState<{[key: number]: string}>({});

  useEffect(() => {
    const fetchUsers = async () => {
      const userIds = [...new Set(transactions.map(t => t.userId))];
      const promises = userIds.map(id => 
        fetch(`/api/user/${id}`).then(res => res.json())
      );
      const userDetails = await Promise.all(promises);
      const userMap = userDetails.reduce((acc, user) => {
        acc[user.id] = user.name;
        return acc;
      }, {});
      setUsers(userMap);
   
    };

    fetchUsers();
  }, [transactions]);

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
                  ? `Sent to ${users[t.userId] || `User ${t.userId}`}`
                  : `Received from ${users[t.userId] || `User ${t.userId}`}`}
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

export default P2PTransactions;