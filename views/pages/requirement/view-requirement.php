<?php
/**
 * View Requirements Page
 *
 * Displays a list of all requirements in a table format.
 * Fetches data server-side from the API for better performance.
 *
 * @author CCSync Development Team
 * @version 1.0
 */

// Fetch requirements from API
$apiUrl = "http://localhost:8080/ccsync-plain-php/requirement/getRequirements.php";
$requirements = [];

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
        if (isset($data['requirements'])) {
            $requirements = $data['requirements'];
        }
    }
} catch (Exception $e) {
    error_log("Error fetching requirements: " . $e->getMessage());
    $requirements = [];
}
?>

<div class="container mt-4">
    <h1 class="mb-4">View Requirements</h1>

    <div class="d-flex justify-content-between align-items-center mb-3">
        <p class="mb-0">Manage and view all requirements.</p>
        <a href="?page=requirement/add-requirement" class="btn btn-primary">Add New Requirement</a>
    </div>

    <div class="table-responsive">
        <table class="table table-striped table-hover">
            <thead class="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($requirements)): ?>
                    <tr>
                        <td colspan="4" class="text-center text-muted">
                            No requirements found. <a href="?page=requirement/add-requirement">Add a new requirement</a>.
                        </td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($requirements as $req): ?>
                        <tr>
                            <td><?php echo htmlspecialchars($req['id']); ?></td>
                            <td><?php echo htmlspecialchars($req['title']); ?></td>
                            <td><?php echo htmlspecialchars($req['description']); ?></td>
                            <td>
                                <button class="btn btn-sm btn-outline-primary me-2" onclick="editRequirement('<?php echo $req['id']; ?>')">Edit</button>
                                <button class="btn btn-sm btn-outline-danger" onclick="deleteRequirement('<?php echo $req['id']; ?>')">Delete</button>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>
