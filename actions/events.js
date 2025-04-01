"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { eventSchema } from "@/app/lib/validators";
import { createGoogleCalendarEvent, deleteGoogleCalendarEvent } from "@/lib/googleCalendar";

export async function createEvent(data) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const validatedData = eventSchema.parse(data);

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      id: true,
      email: true,
      name: true,
      clerkUserId: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Try to get the user's Google OAuth token
  let googleCalendarData = { success: false };
  try {
    const { data: oauthData } = await clerkClient.users.getUserOauthAccessToken(
      userId,
      "oauth_google"
    );

    const token = oauthData[0]?.token;

    if (token) {
      // Create event in Google Calendar
      googleCalendarData = await createGoogleCalendarEvent(
        token,
        validatedData,
        {
          email: user.email,
          name: user.name,
        }
      );
    }
  } catch (error) {
    console.error("Error with Google Calendar integration:", error);
    // Continue with event creation even if Google Calendar fails
  }

  // Create event in database with Google Calendar data if available
  const eventData = {
    ...validatedData,
    userId: user.id,
  };

  if (googleCalendarData.success) {
    eventData.googleEventId = googleCalendarData.googleEventId;
    eventData.googleEventLink = googleCalendarData.googleEventLink;
  }

  const event = await db.event.create({
    data: eventData,
  });

  return {
    ...event,
    googleCalendarIntegrated: googleCalendarData.success,
  };
}

export async function getUserEvents() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const events = await db.event.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { bookings: true },
      },
    },
  });

  return { events, username: user.username };
}

export async function deleteEvent(eventId) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const event = await db.event.findUnique({
    where: { id: eventId },
  });

  if (!event || event.userId !== user.id) {
    throw new Error("Event not found or unauthorized");
  }

  // If the event has a Google Calendar ID, try to delete it
  if (event.googleEventId) {
    try {
      const { data: oauthData } = await clerkClient.users.getUserOauthAccessToken(
        userId,
        "oauth_google"
      );

      const token = oauthData[0]?.token;

      if (token) {
        await deleteGoogleCalendarEvent(token, event.googleEventId);
      }
    } catch (error) {
      console.error("Error deleting Google Calendar event:", error);
      // Continue with deletion even if Google Calendar fails
    }
  }

  await db.event.delete({
    where: { id: eventId },
  });

  return { success: true };
}

export async function getEventDetails(username, eventId) {
  const event = await db.event.findFirst({
    where: {
      id: eventId,
      user: {
        username: username,
      },
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          imageUrl: true,
        },
      },
    },
  });

  return event;
}
