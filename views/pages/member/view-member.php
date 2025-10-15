<?php
/**
 * View Members Page
 *
 * Displays a list of all registered members in a table format.
 * Fetches data server-side from the database for better performance.
 *
 * @author CCSync Development Team
 * @version 1.0
 */

// Include database configuration
require_once __DIR__ . '/../../../temp/config/database.php';

try {
    $query = "SELECT * FROM users ORDER BY name_first ASC";
    $result = $conn->query($query);

    $users = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
    }
} catch (Exception $e) {
    error_log("Error fetching users: " . $e->getMessage());
    $users = [];
}
?>

<div class="container mt-4">
    <h1 class="mb-4">View Members</h1>

    <div class="d-flex justify-content-between align-items-center mb-3">
        <p class="mb-0">Manage and view all registered members.</p>
        <a href="?page=member/register-member" class="btn btn-primary">Register New Member</a>
    </div>

    <div class="table-responsive">
        <table class="table table-striped table-hover">
            <thead class="table-dark">
                <tr>
                    <th>ID Number</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($users)): ?>
                    <tr>
                        <td colspan="5" class="text-center text-muted">
                            No members found. <a href="?page=member/register-member">Register a new member</a>.
                        </td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($users as $user): ?>
                        <tr>
                            <td><?php echo htmlspecialchars($user['id_school_number']); ?></td>
                            <td><?php echo htmlspecialchars($user['name_first']); ?></td>
                            <td><?php echo htmlspecialchars($user['name_last']); ?></td>
                            <td><?php echo htmlspecialchars($user['email']); ?></td>
                            <td>
                                <button class="btn btn-sm btn-outline-primary me-2" onclick="editMember('<?php echo $user['id']; ?>')">Edit</button>
                                <button class="btn btn-sm btn-outline-danger" onclick="deleteMember('<?php echo $user['id']; ?>')">Delete</button>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>
