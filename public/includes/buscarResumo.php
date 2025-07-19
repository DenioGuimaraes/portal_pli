<?php
    require_once __DIR__ . '/../../app/core/Model.php';

    $modelo = new Model();
    $db = $modelo->db;

    $stmt = $db->prepare("SELECT * FROM resumo_operacional WHERE id = 1");
    $stmt->execute();
    $resultado = $stmt->get_result();
    $resumo = $resultado->fetch_assoc();

    echo json_encode($resumo);
