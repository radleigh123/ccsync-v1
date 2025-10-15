<?php
/**
 * Edit Event Page
 *
 * Provides a form for editing existing events.
 *
 * @author CCSync Development Team
 * @version 1.0
 */

$eventId = $_GET['event_id'] ?? null;
if (!$eventId) {
    echo "<p>Event ID is required.</p>";
    exit;
}

// Placeholder: Fetch event details
$event = ['id' => $eventId, 'name' => 'Sample Event', 'event_date' => '2025-01-01', 'max_participants' => 100, 'venue' => 'Sample Venue'];
?>

<div class="container mt-4">
    <h1 class="mb-4">Edit Event</h1>

    <div class="row justify-content-center">
        <div class="col-md-6">
            <form id="editEventForm" class="card p-4 shadow">
                <div class="mb-3">
                    <label for="eventName" class="form-label">Event Name</label>
                    <input type="text" class="form-control" id="eventName" name="eventName" value="<?php echo htmlspecialchars($event['name']); ?>" required>
                </div>
                <div class="mb-3">
                    <label for="eventDate" class="form-label">Event Date</label>
                    <input type="date" class="form-control" id="eventDate" name="eventDate" value="<?php echo htmlspecialchars($event['event_date']); ?>" required>
                </div>
                <div class="mb-3">
                    <label for="maxParticipants" class="form-label">Max Participants</label>
                    <input type="number" class="form-control" id="maxParticipants" name="maxParticipants" value="<?php echo htmlspecialchars($event['max_participants']); ?>" required>
                </div>
                <div class="mb-3">
                    <label for="venue" class="form-label">Venue</label>
                    <input type="text" class="form-control" id="venue" name="venue" value="<?php echo htmlspecialchars($event['venue']); ?>" required>
                </div>
                <button type="submit" class="btn btn-primary w-100">Update Event</button>
            </form>

            <div id="message" class="mt-3" style="display: none;"></div>
        </div>
    </div>

    <div class="text-center mt-3">
        <a href="?page=event/view-event" class="btn btn-secondary">Back to View Events</a>
    </div>
</div>
