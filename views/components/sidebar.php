<?php
/**
 * Sidebar Component
 *
 * Generates a role-based sidebar navigation menu.
 * This component replaces the client-side JavaScript implementation
 * for better performance and SEO.
 *
 * @author CCSync Development Team
 * @version 1.0
 */

// Menu configuration based on user role
$menuConfig = [
    'admin' => [
        [
            'type' => 'link',
            'href' => '?page=home',
            'title' => 'Dashboard',
            'icon' => 'bi bi-house-fill',
            'text' => 'Dashboard',
            'active' => true
        ],
        [
            'type' => 'dropdown',
            'title' => 'Member management',
            'icon' => 'bi bi-person-circle',
            'text' => 'Member management',
            'submenu' => [
                ['href' => '?page=member/view-member', 'text' => 'View members'],
                ['href' => '?page=member/register-member', 'text' => 'Register member']
            ]
        ],
        [
            'type' => 'dropdown',
            'title' => 'Event management',
            'icon' => 'bi bi-calendar2-week-fill',
            'text' => 'Event management',
            'submenu' => [
                ['href' => '?page=event/view-event', 'text' => 'View events'],
                ['href' => '?page=event/add-event', 'text' => 'Add event']
            ]
        ],
        [
            'type' => 'dropdown',
            'title' => 'Requirement management',
            'icon' => 'bi bi-file-text-fill',
            'text' => 'Requirement management',
            'submenu' => [
                ['href' => '?page=requirement/view-requirement', 'text' => 'View requirements'],
                ['href' => '?page=requirement/add-requirement', 'text' => 'Add requirement']
            ]
        ],
        [
            'type' => 'dropdown',
            'title' => 'Officer management',
            'icon' => 'bi bi-hdd-rack-fill',
            'text' => 'Officer management',
            'submenu' => [
                ['href' => '?page=officer/view-officer', 'text' => 'View officers'],
                ['href' => '?page=officer/add-officer', 'text' => 'Add officer']
            ]
        ]
    ],
    'user' => [
        [
            'type' => 'link',
            'href' => '?page=home',
            'title' => 'Dashboard',
            'icon' => 'bi bi-house-fill',
            'text' => 'Dashboard',
            'active' => true
        ]
    ]
];

// Get user role (assume from session or similar)
$userRole = $_SESSION['user']['role'] ?? 'user';
$menuItems = $menuConfig[$userRole] ?? $menuConfig['user'];

/**
 * Generates HTML for menu items.
 *
 * @param array $items Array of menu item configurations.
 * @return string Generated HTML string.
 */
function generateMenuHTML($items) {
    $html = '';
    foreach ($items as $item) {
        if ($item['type'] === 'link') {
            $activeClass = $item['active'] ? 'active' : '';
            $html .= "
                <li class='{$activeClass}'>
                    <a href='{$item['href']}' class='justify-content-center' title='{$item['title']}' data-bs-toggle='tooltip' data-bs-placement='right'>
                        <i class='{$item['icon']}' style='font-size: 16px'></i>
                        <span>{$item['text']}</span>
                    </a>
                </li>
            ";
        } elseif ($item['type'] === 'dropdown') {
            $html .= "
                <li>
                    <button class='dropdown-btn justify-content-center' data-bs-toggle='tooltip' data-bs-placement='right' title='{$item['title']}'>
                        <i class='{$item['icon']}'></i>
                        <span>{$item['text']}</span>
                    </button>
                    <ul class='sub-menu'>
                        <div class='me-auto' style='padding-left: 40px'>
            ";
            foreach ($item['submenu'] as $sub) {
                $html .= "<li><a href='{$sub['href']}' class='px-2'>{$sub['text']}</a></li>";
            }
            $html .= "
                        </div>
                    </ul>
                </li>
            ";
        }
    }
    return $html;
}

// Get user info
$userName = $_SESSION['user']['name'] ?? 'USER NAME';
$userId = $_SESSION['user']['id_school_number'] ?? 'ID NUMBER';
?>

<!-- Sidebar -->
<nav id="sidebar">
  <div id="sidebar-header" class="justify-content-center align-items-center">
    <a class="navbar-brand d-flex p-1" href="?page=home">
      <img src="/assets/PSITSlogo.png" alt="Logo" class="sidebar-logo me-2" />
    </a>
  </div>
  <ul class="justify-content-center mb-0" id="sidebar-menu">
    <?php echo generateMenuHTML($menuItems); ?>
  </ul>
  <ul class="justify-content-center mb-0">
    <li class="user-info dropdown align-items-center mb-0">
      <div class="container p-0 m-0 border-0">
        <strong id="user-name"><?php echo htmlspecialchars($userName); ?></strong>
        <small id="user-id"><?php echo htmlspecialchars($userId); ?></small>
      </div>
      <a href="#" class="more-btn text-decoration-none align-items-center" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <i class="bi bi-gear-fill" style="line-height: 18px"></i>
      </a>
      <button id="toggle-btn" style="line-height: 18px">
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" width="20px" viewBox="0 0 960 960" fill="#e8eaed">
          <path d="m313-480 155 156q11 11 11.5 27.5T468-268q-11 11-28 11t-28-11L228-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l184-184q11-11 27.5-11.5T468-692q11 11 11 28t-11 28L313-480Zm264 0 155 156q11 11 11.5 27.5T732-268q-11 11-28 11t-28-11L492-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l184-184q11-11 27.5-11.5T732-692q11 11 11 28t-11 28L577-480Z"/>
        </svg>
      </button>
    </li>
  </ul>
</nav>
