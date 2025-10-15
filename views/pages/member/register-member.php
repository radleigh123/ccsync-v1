<?php
/**
 * Register Member Page
 *
 * Provides a form for registering new members.
 * Submits data to the backend API for processing.
 *
 * @author CCSync Development Team
 * @version 1.0
 */
?>

<div class="container mt-4">
    <h1 class="mb-4">Register New Member</h1>

    <div class="row justify-content-center">
        <div class="col-md-6">
            <form id="registerForm" class="card p-4 shadow">
                <div class="mb-3">
                    <label for="firstName" class="form-label">First Name</label>
                    <input type="text" class="form-control" id="firstName" name="firstName" required>
                </div>
                <div class="mb-3">
                    <label for="lastName" class="form-label">Last Name</label>
                    <input type="text" class="form-control" id="lastName" name="lastName" required>
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="email" name="email" required>
                </div>
                <div class="mb-3">
                    <label for="idNumber" class="form-label">ID Number</label>
                    <input type="text" class="form-control" id="idNumber" name="idNumber" maxlength="10" required>
                    <div class="form-text">Must be 10 characters or less.</div>
                </div>
                <button type="submit" class="btn btn-primary w-100">Register Member</button>
            </form>

            <div id="message" class="mt-3" style="display: none;"></div>
        </div>
    </div>

    <div class="text-center mt-3">
        <a href="?page=member/view-member" class="btn btn-secondary">Back to View Members</a>
    </div>
</div>

<script type="module" src="/js/pages/member/register-member.js"></script>
