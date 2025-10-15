<?php
/**
 * View Events Page
 *
 * Displays a list of all events in a card-based layout.
 * Fetches data server-side from the API for better performance.
 *
 * @author CCSync Development Team
 * @version 1.0
 */

// Fetch events from API
$apiUrl = "http://localhost:8080/ccsync-plain-php/event/getEvents.php";
$events = [];

try {
    $context = stream_context_create([
        "http" => [
            "method" => "GET",
            "header" => "Accept: application/json\r\n"
        ]
    ]);
    $response = file_get_contents($apiUrl, false, $context);
    if ($response !== false) {
        $data = json_decode($response, true);
        if (isset($data['events'])) {
            $events = $data['events'];
        }
    }
} catch (Exception $e) {
    error_log("Error fetching events: " . $e->getMessage());
    $events = [];
}
?>

<div class="container mt-4">
    <h1 class="mb-4">View Events</h1>

    <div class="d-flex justify-content-between align-items-center mb-3">
        <p class="mb-0">Manage and view all events.</p>
        <a href="?page=event/add-event" class="btn btn-primary">Add New Event</a>
    </div>

    <div id="eventContainer" class="row gap-4">
        <?php if (empty($events)): ?>
            <div class="col-12 text-center text-info h4">
                No events available.
            </div>
        <?php else: ?>
            <?php foreach ($events as $event): ?>
                <div class="card px-0 col-md-4 col-sm-6 mb-4" id="eventCardItem">
                    <div class="card-body">
                        <h5 class="card-title"><?php echo htmlspecialchars($event['name']); ?></h5>

                        <div class="event-details">
                            <div class="d-flex">
                                <i class="bi bi-calendar-event"></i>
                                <span class="event-label">Date:</span>
                                <p class="event-value"><?php echo htmlspecialchars($event['event_date']); ?></p>
                            </div>
                            <div class="d-flex">
                                <i class="bi bi-people"></i>
                                <span class="event-label">Attendees:</span>
                                <p class="event-value"><?php echo htmlspecialchars($event['max_participants']); ?></p>
                            </div>
                            <div class="d-flex">
                                <i class="bi bi-geo-alt"></i>
                                <span class="event-label">Venue:</span>
                                <p class="event-value"><?php echo htmlspecialchars($event['venue']); ?></p>
                            </div>
                        </div>
                    </div>

                    <div id="eventCardActions" class="card-body pt-0">
                        <div class="d-flex">
                            <div class="action-item me-2">
                                <a href="?page=event/add-event-person&event_id=<?php echo $event['id']; ?>" class="text-decoration-none">
                                    <i class="bi bi-person-plus"></i>
                                </a>
                            </div>
                            <div class="action-item me-2">
                                <a href="?page=event/edit-event&event_id=<?php echo $event['id']; ?>" class="text-decoration-none">
                                    <i class="bi bi-pencil-square"></i>
                                </a>
                            </div>
                            <div class="action-item">
                                <a href="?page=event/view-event-single&event_id=<?php echo $event['id']; ?>" class="text-decoration-none">
                                    <i class="bi bi-eye"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>
</div>
