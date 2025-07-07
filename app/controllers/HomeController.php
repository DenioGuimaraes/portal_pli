<?php
class HomeController extends Controller {
    public function index() {
        $conteudo = 'home/index.php';
        require_once __DIR__ . '/../views/template.php';
    }
}

?>
