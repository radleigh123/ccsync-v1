<?php
/**
 * Add Event Participant Page
 *
 * Provides a form for adding participants to an event.
 * Fetches participant information based on ID number.
 *
 * @author CCSync Development Team
 * @version 1.0
 */

$eventId = $_GET['event_id'] ?? null;
if (!$eventId) {
    echo "<p>Event ID is required.</p>";
    exit;
}

// Fetch event details (placeholder, assume API or DB)
$event = ['name' => 'Sample Event', 'id' => $eventId]; // Replace with actual fetch
?>

<div class="container-fluid px-0">
    <div class="d-flex flex-row gap-3 align-items-center">
        <a href="?page=event/view-event" class="text-decoration-none">
            <i class="bi bi-caret-left-fill p-0 m-0"></i>
        </a>
        <p class="p-0 m-0 h3 fw-bold">Add a participant to <?php echo htmlspecialchars($event['name']); ?></p>
    </div>
</div>

<div id="cardContainer" class="card px-0 mt-4">
    <div class="card-body">
        <h4 class="card-title" id="eventCardTitle"><?php echo htmlspecialchars($event['name']); ?></h4>
        <hr />
        <form id="addParticipantForm">
            <div class="d-flex flex-row gap-2 mb-3">
                <p class="my-0 py-0">ID number:</p>
                <input type="text" class="form-control" id="idNumber" placeholder="Enter ID number" required />
            </div>
            <div class="card-body">
                <div id="participantInfo" class="card border-0">
                    <p class="my-0 align-items-center p-3 py-2 fw-bold">Participant information:</p>
                    <div class="card-body">
                        Enter an ID number to fetch participant details.
                    </div>
                </div>
            </div>
            <div class="d-flex flex-row justify-content-around gap-5 mt-3 px-3">
                <a href="?page=event/view-event" role="button" class="btn btn-secondary flex-fill fw-bold">Cancel</a>
                <button type="submit" class="btn btn-primary-ccsync flex-fill fw-bold">Register</button>
            </div>
        </form>
    </div>
</div>
