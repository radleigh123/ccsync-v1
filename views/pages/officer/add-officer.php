<?php
/**
 * Add Officer Page
 *
 * Provides a form for adding new officers.
 * Submits data to the backend API for processing.
 *
 * @author CCSync Development Team
 * @version 1.0
 */
?>

<div class="container mt-4">
    <h1 class="mb-4">Add New Officer</h1>

    <div class="row justify-content-center">
        <div class="col-md-6">
            <form id="addOfficerForm" class="card p-4 shadow">
                <div class="mb-3">
                    <label for="name" class="form-label">Name</label>
                    <input type="text" class="form-control" id="name" name="name" required>
                </div>
                <div class="mb-3">
                    <label for="position" class="form-label">Position</label>
                    <input type="text" class="form-control" id="position" name="position" required>
                </div>
                <button type="submit" class="btn btn-primary w-100">Add Officer</button>
            </form>

            <div id="message" class="mt-3" style="display: none;"></div>
        </div>
    </div>

    <div class="text-center mt-3">
        <a href="?page=officer/view-officer" class="btn btn-secondary">Back to View Officers</a>
    </div>
</div>
