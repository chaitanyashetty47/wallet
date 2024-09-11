"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function createOnRampTransaction(amount: number, provider: string) {
    const session = await getServerSession(authOptions);
    const token = Math.random().toString();
    const userId = session.user.id;
    if (!userId) {
        return {
            message: "User not logged in"
        }
    }
    await prisma.onRampTransaction.create({
        data: {
            userId: Number(userId), // 1
            amount: amount,
            status: "Processing",
            startTime: new Date(),
            provider,
            token: token
        }
    })
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/hdfcWebhook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_identifier:userId, amount, token }),
        });
        console.log(response);

        if (!response.ok) {
            throw new Error('Failed to send data to backend');
        }
    } catch (error) {
        console.error('Error sending data to backend:', error);
        
    }

    return {
        message: "On ramp transaction added"
    }
}