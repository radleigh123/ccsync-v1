<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>CCSync</title>
  <!-- Include global styles and scripts -->
  <link rel="stylesheet" href="/scss/styles.scss">
  <script type="module" src="/js/core.js"></script>
</head>
<body>
  <!-- Include sidebar component -->
  <?php include '../components/sidebar.php'; ?>

  <!-- Main Content Area -->
  <main id="main-content">
    <!-- Page content will be included here -->
    <?php
    // Dynamic include based on current page
    $page = $_GET['page'] ?? 'home';
    $contentFile = "../pages/{$page}/layout-content.php";
    if (file_exists($contentFile)) {
      include $contentFile;
    } else {
      echo "<p>Page not found.</p>";
    }
    ?>
  </main>

  <!-- Include page-specific scripts if needed -->
  <?php
  $scriptFile = "../js/pages/{$page}/{$page}.js";
  if (file_exists($scriptFile)) {
    echo "<script type='module' src='/$scriptFile'></script>";
  }
  ?>
</body>
</html>
