<?php

namespace App\Models;

use App\Core\Database;
use mysqli;

class User
{
    private ?mysqli $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    /**
     * Obtener todos los usuarios registrados en el sistema.
     */
    public function getAll(): array
    {
        $users = [];
        if (!$this->db || $this->db->connect_error) {
            return $users;
        }

        $sql = "SELECT id, nombre, correo, tipo_usuario, activo, fecha_creacion 
                FROM usuarios 
                ORDER BY id DESC";

        if ($res = $this->db->query($sql)) {
            while ($row = $res->fetch_assoc()) {
                $tipo = (int)$row['tipo_usuario'];
                $tipoLabel = match ($tipo) {
                    0 => 'Super Administrador',
                    1 => 'Administrador',
                    default => 'Operador'
                };

                $users[] = [
                    'id' => (int)$row['id'],
                    'nombre' => (string)$row['nombre'],
                    'correo' => (string)$row['correo'],
                    'tipo_usuario' => $tipo,
                    'tipo_usuario_label' => $tipoLabel,
                    'activo' => (int)($row['activo'] ?? 1),
                    'fecha_creacion' => $row['fecha_creacion'] ?: null
                ];
            }
            $res->free();
        }

        return $users;
    }

    /**
     * Buscar un usuario por su correo electrónico.
     */
    public function findByEmail(string $email): ?array
    {
        if (!$this->db || $this->db->connect_error) {
            return null;
        }

        $sql = "SELECT id, contrasena, tipo_usuario, nombre, activo, correo FROM usuarios WHERE correo = ? LIMIT 1";
        $stmt = $this->db->prepare($sql);
        if (!$stmt) {
            return null;
        }

        $stmt->bind_param('s', $email);
        $stmt->execute();
        $res = $stmt->get_result();
        $user = $res->fetch_assoc();
        $stmt->close();

        return $user ?: null;
    }

    /**
     * Buscar un usuario por su ID.
     */
    public function findById(int $id): ?array
    {
        if (!$this->db || $this->db->connect_error) {
            return null;
        }

        $sql = "SELECT id, tipo_usuario, nombre, correo, activo FROM usuarios WHERE id = ? LIMIT 1";
        $stmt = $this->db->prepare($sql);
        if (!$stmt) {
            return null;
        }

        $stmt->bind_param('i', $id);
        $stmt->execute();
        $res = $stmt->get_result();
        $user = $res->fetch_assoc();
        $stmt->close();

        return $user ?: null;
    }

    /**
     * Crear un nuevo usuario en el sistema.
     */
    public function create(string $name, string $email, string $plainPassword, int $tipoUsuario = 1, int $activo = 1): int
    {
        if (!$this->db || $this->db->connect_error) {
            return 0;
        }

        $hash = password_hash($plainPassword, PASSWORD_DEFAULT);
        $sql = 'INSERT INTO usuarios (nombre, correo, contrasena, tipo_usuario, activo) VALUES (?, ?, ?, ?, ?)';

        $stmt = $this->db->prepare($sql);
        if (!$stmt) {
            return 0;
        }

        $stmt->bind_param('sssii', $name, $email, $hash, $tipoUsuario, $activo);
        if ($stmt->execute()) {
            $id = (int)$stmt->insert_id;
            $stmt->close();
            return $id;
        }

        $stmt->close();
        return 0;
    }

    /**
     * Actualizar estado activo/inactivo de un usuario.
     */
    public function updateStatus(int $userId, int $active): bool
    {
        if (!$this->db || $this->db->connect_error) {
            return false;
        }

        $stmt = $this->db->prepare("UPDATE usuarios SET activo = ? WHERE id = ?");
        if ($stmt) {
            $stmt->bind_param('ii', $active, $userId);
            $success = $stmt->execute();
            $stmt->close();
            return $success;
        }

        return false;
    }

    /**
     * Actualizar la contraseña de un usuario existente.
     */
    public function updatePassword(int $userId, string $newPlainPassword): bool
    {
        if (!$this->db || $this->db->connect_error) {
            return false;
        }

        $newHash = password_hash($newPlainPassword, PASSWORD_DEFAULT);
        $stmt = $this->db->prepare('UPDATE usuarios SET contrasena = ? WHERE id = ?');
        if ($stmt) {
            $stmt->bind_param('si', $newHash, $userId);
            $success = $stmt->execute();
            $stmt->close();
            return $success;
        }

        return false;
    }

    /**
     * Verifica la contraseña probando BCrypt, Texto Plano y MD5 Legacy.
     */
    public function verifyAndUpgradePassword(int $userId, string $plainPassword, string $storedHash): bool
    {
        $storedHash = trim($storedHash);
        if ($storedHash === '') {
            return false;
        }

        // 1. Algoritmo estándar BCrypt
        if (password_get_info($storedHash)['algo'] !== 0) {
            if (password_verify($plainPassword, $storedHash)) {
                return true;
            }
        }

        // 2. Texto plano (Legacy fallback)
        if (hash_equals($storedHash, $plainPassword)) {
            $this->updatePassword($userId, $plainPassword);
            return true;
        }

        // 3. MD5 (Legacy fallback usuarios antiguos)
        if (strlen($storedHash) === 32 && ctype_xdigit($storedHash) && hash_equals($storedHash, md5($plainPassword))) {
            $this->updatePassword($userId, $plainPassword);
            return true;
        }

        return false;
    }
}
