<?php
class Model {
    protected $db;

    public function __construct() {
        $this->db = new mysqli('localhost', 'root', '', 'Portal_PLI');
        
        if ($this->db->connect_error) {
            die('Erro de conexão: ' . $this->db->connect_error);
        }
    }
}
?>
