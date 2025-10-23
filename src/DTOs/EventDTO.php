<?php
/**
 * @fileoverview Event Data Transfer Objects
 * 
 * Canonical event entity definitions - single source of truth for all event-related data structures
 * 
 * Structure:
 * - EventDTO: Complete event profile (read operations)
 * - EventCreateDTO: Data for event creation
 * - EventUpdateDTO: Data for event updates (partial fields)
 * - EventQueryDTO: Data for event search/filtering
 * - EventParticipantDTO: Event participant/attendance data
 * - EventResponseDTO: Response for event list/detail API
 *
 * @author CCSync Development Team
 * @version 1.0
 */

/**
 * Complete Event Profile DTO
 * 
 * Represents all event information in the system
 * Used for read operations and API responses
 * 
 * Field Mapping:
 * - id: Primary key
 * - title: Event name/title (user input)
 * - description: Event description/details (user input)
 * - startDate: Event start date (user input, YYYY-MM-DD)
 * - endDate: Event end date (user input, YYYY-MM-DD, optional)
 * - location: Event location/venue (user input)
 * - capacity: Max participants allowed (user input, optional)
 * - attendees: Current attendee count (read-only, calculated)
 * - status: Event status (active, cancelled, completed)
 * - createdBy: User ID of event creator (system)
 * - createdAt: Timestamp when event was created (system)
 * - updatedAt: Timestamp of last update (system)
 * 
 * @interface
 */
class EventDTO {
    public int $id;                              // Primary key
    public string $title;                        // Event title
    public string $description;                  // Event description
    public string $startDate;                    // YYYY-MM-DD format
    public ?string $endDate;                     // YYYY-MM-DD format (optional, single-day event if null)
    public string $location;                     // Event venue/location
    public ?int $capacity;                       // Max attendees (optional, unlimited if null)
    public int $attendees;                       // Current count of attendees (read-only)
    public string $status;                       // active, cancelled, completed
    public int $createdBy;                       // User ID of creator
    public string $createdAt;                    // ISO 8601 timestamp
    public string $updatedAt;                    // ISO 8601 timestamp
}

/**
 * Event Data for Creation
 * 
 * Subset of EventDTO used when creating new events
 * Contains only fields needed during event creation
 * 
 * Required fields:
 * - title (required, string)
 * - description (required, string)
 * - startDate (required, YYYY-MM-DD format)
 * - location (required, string)
 * 
 * Optional fields:
 * - endDate (optional, YYYY-MM-DD format, must be >= startDate)
 * - capacity (optional, int > 0)
 * 
 * System-generated fields (server-side):
 * - id (generated on insert)
 * - status (default: 'active')
 * - createdBy (from session/auth)
 * - attendees (default: 0)
 * - createdAt (current timestamp)
 * - updatedAt (current timestamp)
 * 
 * @interface
 */
class EventCreateDTO {
    public string $title;                        // User input (required, min 3, max 255)
    public string $description;                  // User input (required, min 10, max 5000)
    public string $startDate;                    // User input (required, YYYY-MM-DD, future date)
    public ?string $endDate;                     // User input (optional, >= startDate)
    public string $location;                     // User input (required, min 3, max 255)
    public ?int $capacity;                       // User input (optional, int > 0)
}

/**
 * Event Data for Updates
 * 
 * Partial subset allowing selective field updates
 * All fields optional - only update fields that are present
 * 
 * Immutable fields (cannot update):
 * - id, createdBy, createdAt
 * 
 * Updatable fields:
 * - title, description, startDate, endDate, location, capacity, status
 * 
 * Constraints:
 * - startDate cannot be changed to a past date
 * - endDate must be >= startDate if both are provided
 * - status can only transition to valid states (active → cancelled, active → completed)
 * - capacity can only be increased or decreased (but not below current attendees)
 * 
 * @interface
 */
class EventUpdateDTO {
    public ?string $title;                       // Optional (min 3, max 255 if provided)
    public ?string $description;                 // Optional (min 10, max 5000 if provided)
    public ?string $startDate;                   // Optional (YYYY-MM-DD format if provided)
    public ?string $endDate;                     // Optional (YYYY-MM-DD format or null, >= startDate if provided)
    public ?string $location;                    // Optional (min 3, max 255 if provided)
    public ?int $capacity;                       // Optional (int > current attendees if provided)
    public ?string $status;                      // Optional (active, cancelled, completed)
}

/**
 * Event Search/Filter Query
 * 
 * Used for finding events by various criteria
 * All fields optional - search only by fields that are specified
 * 
 * @interface
 */
class EventQueryDTO {
    public ?string $title;                       // Partial match (LIKE search)
    public ?string $status;                      // Exact match (active, cancelled, completed)
    public ?string $startDate;                   // Date range start (YYYY-MM-DD, >= this date)
    public ?string $endDate;                     // Date range end (YYYY-MM-DD, <= this date)
    public ?string $location;                    // Partial match (LIKE search)
    public ?int $createdBy;                      // Exact match (filter by creator)
    public ?bool $upcomingOnly;                  // Filter: true = only future events, false = all
    public ?bool $hasAvailability;               // Filter: true = has open spots, false = full
}

/**
 * Event Participant/Attendance Data
 * 
 * Tracks member participation in events
 * Links members to events with attendance/feedback information
 * 
 * @interface
 */
class EventParticipantDTO {
    public int $id;                              // Primary key
    public int $eventId;                         // FK to events table
    public int $memberId;                        // FK to members table
    public string $status;                       // attended, absent, pending (for future events)
    public ?string $feedback;                    // Optional member feedback/comments
    public bool $hasPoints;                      // Whether member earned activity points
    public int $pointsEarned;                    // Number of activity points earned (default: 0)
    public string $registeredAt;                 // ISO 8601 timestamp
    public string $updatedAt;                    // ISO 8601 timestamp
}

/**
 * Response DTO for Event List/Detail API
 * 
 * Minimal event information for API responses
 * Includes aggregated participant data without exposing individual records
 * 
 * Used by:
 * - GET /temp/events/list.php - Event list (without full participant list)
 * - GET /temp/events/detail.php?id=X - Event detail (with participant count)
 * 
 * @interface
 */
class EventResponseDTO {
    public int $id;                              // Event ID
    public string $title;                        // Event title
    public string $description;                  // Event description (short)
    public string $startDate;                    // YYYY-MM-DD
    public ?string $endDate;                     // YYYY-MM-DD (optional)
    public string $location;                     // Event venue
    public ?int $capacity;                       // Max attendees
    public int $attendees;                       // Current attendee count
    public int $availableSpots;                  // capacity - attendees (if capacity set)
    public string $status;                       // active, cancelled, completed
    public string $createdBy;                    // Creator name (not ID)
    public string $createdAt;                    // ISO 8601 timestamp
    public ?int $userParticipationStatus;        // For logged-in users: 1=registered, 0=not registered, null=unknown
}

/**
 * Event Activity Points Award DTO
 * 
 * Used for awarding activity points to attendees
 * Separate from EventParticipantDTO to handle point calculation logic
 * 
 * @interface
 */
class EventActivityPointDTO {
    public int $eventId;                         // Event ID
    public int $memberId;                        // Member ID
    public int $points;                          // Number of points to award
    public string $reason;                       // Reason: attended, officer_conducted, helped_organize
    public ?string $notes;                       // Optional admin notes
}

?>
