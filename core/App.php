<?php
class App {
    protected $controller = 'HomeController';
    protected $method = 'index';
    protected $params = [];

    public function __construct() {
        $url = $this->parseURL();

        // Verifica se o controller existe
        if (file_exists('../app/controllers/' . $url[0] . '.php')) {
            $this->controller = $url[0];
            unset($url[0]);
        }

        require_once '../app/controllers/' . $this->controller . '.php';
        $this->controller = new $this->controller;

        // Verifica se o método existe
        if (isset($url[1]) && method_exists($this->controller, $url[1])) {
            $this->method = $url[1];
            unset($url[1]);
        }

        // Pega os parâmetros restantes (se houver)
        $this->params = $url ? array_values($url) : [];

        // Chama o método dentro do controller com os parâmetros
        call_user_func_array([$this->controller, $this->method], $this->params);
    }

    // Quebra a URL em partes: controller/método/parâmetros
    public function parseURL() {
        if (isset($_GET['url'])) {
            return explode('/', filter_var(rtrim($_GET['url'], '/'), FILTER_SANITIZE_URL));
        }
        return ['HomeController'];
    }
}
?>
