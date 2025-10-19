<?php
/**
 * Add Requirement Page
 *
 * Provides a form for adding new requirements.
 * Submits data to the backend API for processing.
 *
 * @author CCSync Development Team
 * @version 1.0
 */
?>

<div class="container mt-4">
    <h1 class="mb-4">Add New Requirement</h1>

    <div class="row justify-content-center">
        <div class="col-md-6">
            <form id="addRequirementForm" class="card p-4 shadow">
                <div class="mb-3">
                    <label for="title" class="form-label">Title</label>
                    <input type="text" class="form-control" id="title" name="title" required>
                </div>
                <div class="mb-3">
                    <label for="description" class="form-label">Description</label>
                    <textarea class="form-control" id="description" name="description" rows="3" required></textarea>
                </div>
                <button type="submit" class="btn btn-primary w-100">Add Requirement</button>
            </form>

            <div id="message" class="mt-3" style="display: none;"></div>
        </div>
    </div>

    <div class="text-center mt-3">
        <a href="?page=requirement/view-requirement" class="btn btn-secondary">Back to View Requirements</a>
    </div>
</div>
