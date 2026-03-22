<?php
// Set the default character set for all PHP operations
mb_internal_encoding('UTF-8');

if (!isset($_GET['file'])) {
    http_response_code(400);
    echo "Missing file parameter.";
    exit;
}

$filename = basename($_GET['file']); // Prevent directory traversal
$filepath = __DIR__ . '/../../../../public_html/confess/' . $filename;

if (!file_exists($filepath)) {
    http_response_code(404);
    echo "File not found.";
    exit;
}

// Read the raw file content
$content = file_get_contents($filepath);

// For confess folder, all files appear to be in English with Windows-1252 encoding
// based on the analysis, no Cyrillic or Greek content was detected

// List of files that might contain special characters (if any are discovered later)
$specialEncodingFiles = array(
    // Add files here if we discover any with special encoding needs
);

// Check if this is a file with special encoding needs
$isSpecialEncodingFile = in_array($filename, $specialEncodingFiles);

if ($isSpecialEncodingFile) {
    // Handle special encoding if needed
    $content = mb_convert_encoding($content, 'UTF-8', 'Windows-1251');
} else {
    // Default to Windows-1252 for Western European chars
    $content = mb_convert_encoding($content, 'UTF-8', 'Windows-1252');
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