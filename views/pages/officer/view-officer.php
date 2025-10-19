<?php
/**
 * View Officers Page
 *
 * Displays a list of all officers in a table format.
 * Fetches data server-side from the API for better performance.
 *
 * @author CCSync Development Team
 * @version 1.0
 */

// Fetch officers from API
$apiUrl = "http://localhost:8080/ccsync-plain-php/officer/getOfficers.php";
$officers = [];

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
        if (isset($data['officers'])) {
            $officers = $data['officers'];
        }
    }
} catch (Exception $e) {
    error_log("Error fetching officers: " . $e->getMessage());
    $officers = [];
}
?>

<div class="container mt-4">
    <h1 class="mb-4">View Officers</h1>

    <div class="d-flex justify-content-between align-items-center mb-3">
        <p class="mb-0">Manage and view all officers.</p>
        <a href="?page=officer/add-officer" class="btn btn-primary">Add New Officer</a>
    </div>

    <div class="table-responsive">
        <table class="table table-striped table-hover">
            <thead class="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($officers)): ?>
                    <tr>
                        <td colspan="4" class="text-center text-muted">
                            No officers found. <a href="?page=officer/add-officer">Add a new officer</a>.
                        </td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($officers as $officer): ?>
                        <tr>
                            <td><?php echo htmlspecialchars($officer['id']); ?></td>
                            <td><?php echo htmlspecialchars($officer['name']); ?></td>
                            <td><?php echo htmlspecialchars($officer['position']); ?></td>
                            <td>
                                <button class="btn btn-sm btn-outline-primary me-2" onclick="editOfficer('<?php echo $officer['id']; ?>')">Edit</button>
                                <button class="btn btn-sm btn-outline-danger" onclick="deleteOfficer('<?php echo $officer['id']; ?>')">Delete</button>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>
