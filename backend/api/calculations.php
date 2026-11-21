<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
require_once __DIR__ . '/../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query('SELECT id, expression, result, created_at FROM calculations ORDER BY id DESC LIMIT 50');
    echo json_encode($stmt->fetchAll());
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $expression = trim($data['expression'] ?? '');
    $result = trim((string)($data['result'] ?? ''));
    if ($expression === '' || $result === '' || !is_numeric($result)) {
        http_response_code(422);
        echo json_encode(['error' => 'A valid expression and numeric result are required.']);
        exit;
    }
    $stmt = $pdo->prepare('INSERT INTO calculations (expression, result) VALUES (:expression, :result)');
    $stmt->execute(['expression' => $expression, 'result' => $result]);
    echo json_encode(['id' => $pdo->lastInsertId(), 'message' => 'Calculation saved.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
    if (!$id) { http_response_code(422); echo json_encode(['error' => 'A valid calculation ID is required.']); exit; }
    $stmt = $pdo->prepare('DELETE FROM calculations WHERE id = :id');
    $stmt->execute(['id' => $id]);
    echo json_encode(['message' => 'Calculation deleted.']);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed.']);
