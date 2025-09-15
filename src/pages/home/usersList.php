<?php

// require_once __DIR__ . '/../config/database.php';

// header("Content-Type: application/json");
// header("Access-Control-Allow-Origin: http://localhost:5137"); // for dev, allow requests from Vite
// header("Access-Control-Allow-Credentials: true");
// header("Access-Control-Allow-Methods: GET");
// header("Access-Control-Allow-Headers: Content-Type");

// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
//     http_response_code(200);
//     exit;
// }

// try {
//     $query = "SELECT * FROM users";
//     $stmt = $conn->prepare($query);
//     $stmt->execute();

//     $users = $stmt->fetch(PDO::FETCH_ASSOC);

//     if (!$user) {
//         http_response_code(401);
//         echo json_encode([
//             "success" => false,
//             "message" => "EMPTY DATABASE"
//         ]);
//         exit;
//     }

//     http_response_code(200);
//     echo json_encode([
//         "success" => true,
//         "message" => "Login Successful",
//         "user" => $users
//     ]);
// } catch (PDOException $e) {
//     error_log("Login Error: " . $e->getMessage());
//     file_put_contents("debug.log", date('Y-m-d H:i:s') . $e->getMessage() . "\n", FILE_APPEND);
//     http_response_code(500);
//     echo json_encode([
//         "success" => false,
//         "message" => "Users list error"
//     ]);
// }

// $conn = null;

$query = "SELECT id, username, email FROM users";
$result = $conn->query($query);
?>

<table class="table table-striped">
  <thead class="table-dark">
    <tr>
      <th>ID</th>
      <th>Username</th>
      <th>Email</th>
    </tr>
  </thead>
  <tbody>
    <?php if ($result && $result->num_rows > 0): ?>
      <?php while ($row = $result->fetch_assoc()): ?>
        <tr>
          <td><?= htmlspecialchars($row['id']); ?></td>
          <td><?= htmlspecialchars($row['username']); ?></td>
          <td><?= htmlspecialchars($row['email']); ?></td>
        </tr>
      <?php endwhile; ?>
    <?php else: ?>
      <tr>
        <td colspan="3" class="text-center">No users found</td>
      </tr>
    <?php endif; ?>
  </tbody>
</table>