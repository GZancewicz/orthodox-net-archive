<?php
if (!isset($_GET['file'])) {
    http_response_code(400);
    echo "Missing file parameter.";
    exit;
}

$filename = basename($_GET['file']); // Prevent directory traversal
$filepath = __DIR__ . '/../../../../public_html/articles/' . $filename;

if (!file_exists($filepath)) {
    http_response_code(404);
    echo "File not found.";
    exit;
}

$content = file_get_contents($filepath);

// Extract content between <!--BEGIN-CONTENT--> and <!--END-CONTENT-->
if (preg_match('/<!--BEGIN-CONTENT-->[\\s\\r\\n]*(.*?)[\\s\\r\\n]*<!--END-CONTENT-->/is', $content, $matches)) {
    echo $matches[1];
} else {
    echo "Content not found in article file.";
}
?>