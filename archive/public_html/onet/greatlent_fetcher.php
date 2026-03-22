<?php
// Set internal encoding to UTF-8
mb_internal_encoding('UTF-8');

// Get the filename from the query parameter
$filename = isset($_GET['file']) ? basename($_GET['file']) : '';

if (empty($filename)) {
    http_response_code(400);
    echo "No file specified";
    exit;
}

// Security: Ensure the filename doesn't contain path traversal attempts
if (strpos($filename, '..') !== false || strpos($filename, '/') !== false || strpos($filename, '\\') !== false) {
    http_response_code(403);
    echo "Invalid filename";
    exit;
}

// Construct the path to the legacy file
$filepath = __DIR__ . '/../../../../public_html/greatlent/' . $filename;

// Check if file exists
if (!file_exists($filepath)) {
    http_response_code(404);
    echo "File not found";
    exit;
}

// Read the file content
$content = file_get_contents($filepath);

// Convert from Windows-1252 to UTF-8
$content = mb_convert_encoding($content, 'UTF-8', 'Windows-1252');

// Extract content between markers
$output = '';
if (preg_match('/<!--BEGIN-CONTENT-->[\s\r\n]*(.*?)[\s\r\n]*<!--END-CONTENT-->/is', $content, $matches)) {
    $output = $matches[1];
} else {
    // If no markers found, try to extract body content
    if (preg_match('/<body[^>]*>(.*?)<\/body>/is', $content, $matches)) {
        $output = $matches[1];
        // Remove common header/footer elements
        $output = preg_replace('/<div[^>]*class=["\']header["\'][^>]*>.*?<\/div>/is', '', $output);
        $output = preg_replace('/<div[^>]*class=["\']footer["\'][^>]*>.*?<\/div>/is', '', $output);
        $output = preg_replace('/<div[^>]*class=["\']navigation["\'][^>]*>.*?<\/div>/is', '', $output);
    } else {
        // Fallback: return entire content
        $output = $content;
    }
}

// Clean up any remaining encoding issues
$output = str_replace("\xC2\xA0", " ", $output); // Non-breaking spaces
$output = str_replace("\xE2\x80\x99", "'", $output); // Right single quote
$output = str_replace("\xE2\x80\x9C", '"', $output); // Left double quote
$output = str_replace("\xE2\x80\x9D", '"', $output); // Right double quote
$output = str_replace("\xE2\x80\x93", '–', $output); // En dash
$output = str_replace("\xE2\x80\x94", '—', $output); // Em dash

// Set proper headers
header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: public, max-age=3600');

// Output the content
echo $output;
?>