<?php
/**
 * View Single Event Page
 *
 * Displays detailed information about a specific event.
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
$event = [
    'id' => $eventId,
    'name' => 'Sample Event',
    'event_date' => '2025-01-01',
    'max_participants' => 100,
    'venue' => 'Sample Venue',
    'participants' => ['John Doe', 'Jane Smith'] // Placeholder
];
?>

<div class="container mt-4">
    <h1 class="mb-4"><?php echo htmlspecialchars($event['name']); ?></h1>

    <div class="card">
        <div class="card-body">
            <h5 class="card-title">Event Details</h5>
            <p><strong>Date:</strong> <?php echo htmlspecialchars($event['event_date']); ?></p>
            <p><strong>Venue:</strong> <?php echo htmlspecialchars($event['venue']); ?></p>
            <p><strong>Max Participants:</strong> <?php echo htmlspecialchars($event['max_participants']); ?></p>
        </div>
    </div>

    <div class="card mt-4">
        <div class="card-body">
            <h5 class="card-title">Participants</h5>
            <ul>
                <?php foreach ($event['participants'] as $participant): ?>
                    <li><?php echo htmlspecialchars($participant); ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
    </div>

    <div class="text-center mt-3">
        <a href="?page=event/view-event" class="btn btn-secondary">Back to Events</a>
    </div>
</div>
