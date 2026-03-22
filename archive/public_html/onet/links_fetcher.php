<?php
header('Content-Type: text/html; charset=utf-8');

// Get the requested file
$file = isset($_GET['file']) ? $_GET['file'] : '';

// Sanitize the filename to prevent directory traversal
$file = basename($file);

// Validate file extension
if (!preg_match('/\.html?$/i', $file)) {
    http_response_code(400);
    echo "Invalid file type requested";
    exit;
}

// Build the path to the legacy file
// Production path: /public_html/links/
// Local testing path: use __DIR__ relative to content folder
$legacy_path = __DIR__ . '/../../../../public_html/links/' . $file;

// Check if file exists
if (!file_exists($legacy_path)) {
    http_response_code(404);
    echo "File not found";
    exit;
}

// Read the file content
$content = file_get_contents($legacy_path);

// Detect encoding
$encoding = mb_detect_encoding($content, ['Windows-1252', 'Windows-1251', 'UTF-8', 'ISO-8859-1'], true);

// Files known to have Cyrillic content (Windows-1251)
$cyrillic_files = [
    // Add any known files with Cyrillic content here
];

// Check if this file should use Windows-1251 encoding
if (in_array($file, $cyrillic_files) || strpos($file, '-r') !== false) {
    $encoding = 'Windows-1251';
}

// Convert to UTF-8 if needed
if ($encoding && $encoding !== 'UTF-8') {
    $content = mb_convert_encoding($content, 'UTF-8', $encoding);
}

// Extract content between markers
$start_marker = '<!--BEGIN-CONTENT-->';
$end_marker = '<!--END-CONTENT-->';

$start_pos = strpos($content, $start_marker);
$end_pos = strpos($content, $end_marker);

if ($start_pos !== false && $end_pos !== false) {
    $start_pos += strlen($start_marker);
    $extracted_content = substr($content, $start_pos, $end_pos - $start_pos);
} else {
    // If markers not found, try to extract body content
    if (preg_match('/<body[^>]*>(.*?)<\/body>/is', $content, $matches)) {
        $extracted_content = $matches[1];
    } else {
        $extracted_content = $content;
    }
}

// Extract title
$title = '';
if (preg_match('/<title[^>]*>(.*?)<\/title>/is', $content, $matches)) {
    $title = trim(strip_tags($matches[1]));
}

// Return JSON response
header('Content-Type: application/json; charset=utf-8');
echo json_encode([
    'content' => $extracted_content,
    'title' => $title,
    'encoding' => $encoding
]);
?>