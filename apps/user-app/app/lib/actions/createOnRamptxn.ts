"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function createOnRampTransaction(amount: number, provider: string) {
    // Debugging: Log start of the function
    console.log('Starting createOnRampTransaction');
    
    const session = await getServerSession(authOptions);
    const token = Math.random().toString();
    const userId = session.user.id;
    
    // Check if userId is available
    if (!userId) {
        console.error('User not logged in');
        return {
            message: "User not logged in"
        }
    }
    
    // Log userId and token
    console.log('User ID:', userId);
    console.log('Token:', token);
    
    // Create transaction in Prisma
    try {
        await prisma.onRampTransaction.create({
            data: {
                userId: Number(userId),
                amount: amount,
                status: "Processing",
                startTime: new Date(),
                provider,
                token: token
            }
        });
        console.log('Transaction created successfully');
    } catch (error) {
        console.error('Error creating transaction:', error);
        return {
            message: "Failed to create transaction"
        }
    }
    
    // Fetch request to backend
    try {
        console.log('Sending data to backend');
        const response = await fetch(`${process.env.BACKEND_URL}/hdfcWebhook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_identifier: userId, amount, token }),
        });
        
        // Log response
        const responseBody = await response.text(); // Assuming response might be text
        console.log('Backend response:', responseBody);

        if (!response.ok) {
            throw new Error(`Failed to send data to backend: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error sending data to backend:', error);
    }

    // Return response message
    return {
        message: "On ramp transaction added"
    }
}
