<?php
// Western Saints fetcher - based on prototype_fetcher.php
// This fetcher is placed in the content/ directory

// Set the default character set for all PHP operations
mb_internal_encoding('UTF-8');

if (!isset($_GET['file'])) {
    http_response_code(400);
    echo "Missing file parameter.";
    exit;
}

$filename = basename($_GET['file']); // Prevent directory traversal

// Path to western-saints folder
$filepath = __DIR__ . '/../../../../public_html/western-saints/' . $filename;

if (!file_exists($filepath)) {
    http_response_code(404);
    echo "File not found.";
    exit;
}

// Read the raw file content
$content = file_get_contents($filepath);

// For western-saints folder, most content is in English with some Celtic/Nordic names
// These files typically use Windows-1252 encoding

// List of files that might contain special characters (Celtic/Nordic names)
$specialCharFiles = array(
    'acca-and-alcmund-of-hexham.html',
    'alban-amphibalus-aaron-julius.html',
    'congar-bishop-of-congresbury.html',
    'donan-hieromartyr-of-eigg-and-those-with-him.html',
    'fergus-bishop-of-glamis.html',
    'olaf-martyr-king-of-norway.html'
);

// Check if this is a file with special characters
$isSpecialFile = in_array($filename, $specialCharFiles) ||
                 strpos($filename, 'celtic') !== false ||
                 strpos($filename, 'norway') !== false ||
                 strpos($filename, 'ireland') !== false ||
                 strpos($filename, 'scotland') !== false ||
                 strpos($filename, 'wales') !== false;

// Western saints content uses Windows-1252
$content = mb_convert_encoding($content, 'UTF-8', 'Windows-1252');

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