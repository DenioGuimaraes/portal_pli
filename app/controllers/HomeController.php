<?php
class HomeController extends Controller {
    public function index() {
        $conteudo = 'inicio/index.php';
        require_once __DIR__ . '/../views/template.php';
        echo "<script>carregarConteudo('inicio');</script>";
    }
}

?>
