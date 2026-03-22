<?php
// Set the default character set for all PHP operations
mb_internal_encoding('UTF-8');

if (!isset($_GET['file'])) {
    http_response_code(400);
    echo "Missing file parameter.";
    exit;
}

$filename = basename($_GET['file']); // Prevent directory traversal
$filepath = __DIR__ . '/../../../../public_html/sermons/ustav/' . $filename;

if (!file_exists($filepath)) {
    http_response_code(404);
    echo "File not found.";
    exit;
}

// Read the raw file content
$content = file_get_contents($filepath);

// For ustav folder, we'll handle character encoding detection dynamically

// Check encoding based on content detection
$encoding = null;

// Check if content declares specific encoding
if (stripos($content, 'windows-1251') !== false || stripos($content, 'cp1251') !== false) {
    $encoding = 'Windows-1251';
} elseif (stripos($content, 'windows-1252') !== false || stripos($content, 'iso-8859-1') !== false) {
    $encoding = 'Windows-1252';
} elseif (stripos($content, 'windows-1253') !== false || stripos($content, 'iso-8859-7') !== false) {
    $encoding = 'Windows-1253';
}
// Check if content has high bytes that suggest non-ASCII
elseif (preg_match('/[\x80-\xFF]/', $content)) {
    // Try to detect if it's already UTF-8
    if (mb_check_encoding($content, 'UTF-8')) {
        $encoding = 'UTF-8';
    } else {
        // Default to Windows-1252 for Western European
        $encoding = 'Windows-1252';
    }
} else {
    // Appears to be plain ASCII
    $encoding = 'UTF-8';
}

// Convert to UTF-8 if needed
if ($encoding && $encoding !== 'UTF-8') {
    $content = mb_convert_encoding($content, 'UTF-8', $encoding);
}

// Extract content between <!--BEGIN-CONTENT--> and <!--END-CONTENT-->
if (preg_match('/<!--BEGIN-CONTENT-->[\s\r\n]*(.*?)[\s\r\n]*<!--END-CONTENT-->/is', $content, $matches)) {
    $output = $matches[1];
} else {
    // If markers are not found, use the whole file content.
    $output = $content;
}

// Set the correct header and output the UTF-8 content
header('Content-Type: text/html; charset=utf-8');
echo $output;
?>