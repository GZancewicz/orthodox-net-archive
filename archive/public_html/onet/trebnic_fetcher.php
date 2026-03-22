<?php
// Set the default character set for all PHP operations
mb_internal_encoding('UTF-8');

if (!isset($_GET['file'])) {
    http_response_code(400);
    echo "Missing file parameter.";
    exit;
}

$filename = basename($_GET['file']); // Prevent directory traversal

// Path to the legacy trebnic folder
// For local development, use relative path
$filepath = __DIR__ . '/../../../../public_html/trebnic/' . $filename;

if (!file_exists($filepath)) {
    http_response_code(404);
    echo "File not found.";
    exit;
}

// Read the raw file content
$content = file_get_contents($filepath);

// For trebnic folder, we need to handle various encodings
// List of files that might contain Cyrillic (even if they don't have -r in name)
$cyrillicFiles = array(
    'akathist-our-father-among-saints-tikhon.html',
    'akathist-righteous-philaret-mercy.html',
    'akathist-saint-john-maximovitch.html',
    'akathist-st-seraphim-sarov.html',
    'akathist-venerable-herman-alaska.html',
    'canon-guardian-angel.html',
    'canon-holy-communion.html',
    'prayers-various-saints.html'
);

// Check if this is a known Cyrillic file or has Cyrillic indicators
$isCyrillicFile = in_array($filename, $cyrillicFiles) ||
                  strpos($filename, '-r.html') !== false ||
                  strpos($filename, '-r.htm') !== false ||
                  strpos($filename, 'slavonic') !== false ||
                  strpos($filename, 'russian') !== false;

if ($isCyrillicFile) {
    // These files need Windows-1251 encoding for Cyrillic
    $content = mb_convert_encoding($content, 'UTF-8', 'Windows-1251');
} else {
    // Check if content has high-byte characters that suggest Cyrillic
    $highByteCount = 0;
    $sampleSize = min(strlen($content), 1000);
    for ($i = 0; $i < $sampleSize; $i++) {
        $byte = ord($content[$i]);
        if ($byte >= 192 && $byte <= 255) { // Cyrillic range in Windows-1251
            $highByteCount++;
        }
    }
    
    if ($highByteCount > 30) { // If more than 30 high-byte chars in sample
        // Likely Cyrillic content
        $content = mb_convert_encoding($content, 'UTF-8', 'Windows-1251');
    } else {
        // Default to Windows-1252 for Western European chars
        $content = mb_convert_encoding($content, 'UTF-8', 'Windows-1252');
    }
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