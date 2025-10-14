<?php
$menus = ['inicio', 'administrativo', 'u1620', 'u1640', 'emergencia'];
$menu = $_GET['menu'] ?? '';

if (in_array($menu, $menus)) {
    include $menu . '.php';
} else {
    echo "<p>Menu não encontrado.</p>";
}
