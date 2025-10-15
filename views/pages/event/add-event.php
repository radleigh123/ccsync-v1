<?php
/**
 * Add Event Page
 *
 * Provides a form for adding new events.
 * Submits data to the backend API for processing.
 *
 * @author CCSync Development Team
 * @version 1.0
 */
?>

<div class="container mt-4">
    <h1 class="mb-4">Add New Event</h1>

    <div class="row justify-content-center">
        <div class="col-md-6">
            <form id="addEventForm" class="card p-4 shadow">
                <div class="mb-3">
                    <label for="eventName" class="form-label">Event Name</label>
                    <input type="text" class="form-control" id="eventName" name="eventName" required>
                </div>
                <div class="mb-3">
                    <label for="eventDate" class="form-label">Event Date</label>
                    <input type="date" class="form-control" id="eventDate" name="eventDate" required>
                </div>
                <div class="mb-3">
                    <label for="maxParticipants" class="form-label">Max Participants</label>
                    <input type="number" class="form-control" id="maxParticipants" name="maxParticipants" required>
                </div>
                <div class="mb-3">
                    <label for="venue" class="form-label">Venue</label>
                    <input type="text" class="form-control" id="venue" name="venue" required>
                </div>
                <button type="submit" class="btn btn-primary w-100">Add Event</button>
            </form>

            <div id="message" class="mt-3" style="display: none;"></div>
        </div>
    </div>

    <div class="text-center mt-3">
        <a href="?page=event/view-event" class="btn btn-secondary">Back to View Events</a>
    </div>
</div>
