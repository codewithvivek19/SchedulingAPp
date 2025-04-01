import { google } from "googleapis";

/**
 * Creates a Google Calendar event for a MNN Schedulo event
 * @param {string} accessToken - Google OAuth access token
 * @param {object} eventData - Event data from the form
 * @param {object} userData - User data for the event creator
 * @returns {Promise<object>} - Created Google Calendar event data
 */
export async function createGoogleCalendarEvent(accessToken, eventData, userData) {
  try {
    // Set up Google OAuth client
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // Calculate end time based on duration
    const startTime = new Date();
    startTime.setHours(startTime.getHours() + 1); // Start 1 hour from now for demo purposes
    const endTime = new Date(startTime.getTime() + eventData.duration * 60000);

    // Create event in Google Calendar
    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary: eventData.title,
        description: eventData.description || "",
        start: {
          dateTime: startTime.toISOString(),
        },
        end: {
          dateTime: endTime.toISOString(),
        },
        // Add event metadata
        extendedProperties: {
          private: {
            eventId: eventData.id || "pending", // If creating before DB entry
            isPrivate: eventData.isPrivate.toString(),
            createdBy: userData.email,
            schedulingAppId: "mnn-schedulo"
          }
        }
      },
    });

    return {
      googleEventId: response.data.id,
      googleEventLink: response.data.htmlLink,
      success: true
    };
  } catch (error) {
    console.error("Error creating Google Calendar event:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Updates an existing Google Calendar event
 * @param {string} accessToken - Google OAuth access token
 * @param {string} googleEventId - Google Calendar event ID
 * @param {object} eventData - Updated event data
 * @returns {Promise<object>} - Updated Google Calendar event data
 */
export async function updateGoogleCalendarEvent(accessToken, googleEventId, eventData) {
  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    
    // Get existing event first
    const existingEvent = await calendar.events.get({
      calendarId: "primary",
      eventId: googleEventId
    });
    
    // Calculate end time based on duration and existing start time
    const startTime = new Date(existingEvent.data.start.dateTime);
    const endTime = new Date(startTime.getTime() + eventData.duration * 60000);

    // Update event
    const response = await calendar.events.update({
      calendarId: "primary",
      eventId: googleEventId,
      requestBody: {
        summary: eventData.title,
        description: eventData.description || "",
        start: {
          dateTime: startTime.toISOString(),
        },
        end: {
          dateTime: endTime.toISOString(),
        },
        extendedProperties: {
          private: {
            eventId: eventData.id,
            isPrivate: eventData.isPrivate.toString(),
            schedulingAppId: "mnn-schedulo"
          }
        }
      },
    });

    return {
      googleEventId: response.data.id,
      googleEventLink: response.data.htmlLink,
      success: true
    };
  } catch (error) {
    console.error("Error updating Google Calendar event:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Delete a Google Calendar event
 * @param {string} accessToken - Google OAuth access token
 * @param {string} googleEventId - Google Calendar event ID
 * @returns {Promise<object>} - Result of deletion
 */
export async function deleteGoogleCalendarEvent(accessToken, googleEventId) {
  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    
    await calendar.events.delete({
      calendarId: "primary",
      eventId: googleEventId
    });

    return {
      success: true
    };
  } catch (error) {
    console.error("Error deleting Google Calendar event:", error);
    return {
      success: false,
      error: error.message
    };
  }
} 