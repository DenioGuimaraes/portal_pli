<?php
if (isset($_SERVER['HTTP_HOST']) && $_SERVER['HTTP_HOST'] === 'portalpli.cadnorma.com.br') {
    define('BASE_URL', '/');
} else {
    define('BASE_URL', '/Portal_PLI'); // ambiente local
}
