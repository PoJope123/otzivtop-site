<?php
// Приём заявки с сайта и отправка на почту
mb_internal_encoding('UTF-8');

$to = 'info@otzivtop.ru';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /');
    exit;
}

// Простая защита от ботов: скрытое поле должно быть пустым
if (!empty($_POST['website'])) {
    header('Location: /spasibo.html');
    exit;
}

function field($name, $max) {
    $v = isset($_POST[$name]) ? trim((string)$_POST[$name]) : '';
    $v = str_replace(["\r", "\0"], '', $v);
    return mb_substr($v, 0, $max);
}

$name    = field('name', 80);
$contact = field('contact', 120);
$place   = field('place', 150);
$address = field('address', 200);
$link    = field('link', 500);
$tariff  = field('tariff', 60);
$comment = field('comment', 1000);
$agree   = !empty($_POST['agree']);
$news    = !empty($_POST['news']);

if ($name === '' || $contact === '' || ($place === '' && $link === '') || !$agree) {
    header('Location: /?error=1#zakaz');
    exit;
}

$subject = 'Новая заявка: ' . ($place !== '' ? $place : 'заведение') . ' — ' . $tariff;
$body = "Имя: $name\n"
      . "Контакт: $contact\n"
      . "Заведение: " . ($place !== '' ? $place : '—') . "\n"
      . "Город или адрес: " . ($address !== '' ? $address : '—') . "\n"
      . "Ссылка: " . ($link !== '' ? $link : '—') . "\n"
      . "Тариф: $tariff\n"
      . "Комментарий: " . ($comment !== '' ? $comment : '—') . "\n"
      . "Согласие на письма о новых разборах: " . ($news ? 'ДА' : 'нет') . "\n\n"
      . "Время: " . date('d.m.Y H:i') . "\n"
      . "IP: " . ($_SERVER['REMOTE_ADDR'] ?? '') . "\n";

$headers = "From: ОтзывТоп <$to>\r\n"
         . "Content-Type: text/plain; charset=UTF-8\r\n";

mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, $headers);

// Запасная копия заявки в файл (папка закрыта от просмотра через .htaccess)
$dir = __DIR__ . '/zayavki';
if (!is_dir($dir)) { @mkdir($dir, 0700); }
@file_put_contents($dir . '/zayavki.txt', $body . str_repeat('-', 40) . "\n", FILE_APPEND | LOCK_EX);

header('Location: /spasibo.html');
exit;
