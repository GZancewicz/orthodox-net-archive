<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: text/plain; charset=utf-8');

// Test: where are we and can we reach public_html?
$basePath = __DIR__ . '/../../../../public_html/';
echo "Script location: " . __DIR__ . "\n";
echo "Base path: " . realpath($basePath) . "\n";
echo "Base path exists: " . (is_dir($basePath) ? 'YES' : 'NO') . "\n\n";

// Try to list top-level directories in public_html
if (is_dir($basePath)) {
    $dirs = scandir($basePath);
    $categories = array();
    foreach ($dirs as $d) {
        if ($d === '.' || $d === '..') continue;
        $fullPath = $basePath . $d;
        if (is_dir($fullPath)) {
            $count = 0;
            $size = 0;
            $iterator = new RecursiveIteratorIterator(
                new RecursiveDirectoryIterator($fullPath, RecursiveDirectoryIterator::SKIP_DOTS)
            );
            foreach ($iterator as $file) {
                if ($file->isFile()) {
                    $count++;
                    $size += $file->getSize();
                }
            }
            echo sprintf("%-30s %6d files  %10.2f MB\n", $d . "/", $count, $size / 1048576);
        }
    }
} else {
    echo "ERROR: Cannot access public_html at $basePath\n";
    // Try alternate paths
    $alts = array(
        __DIR__ . '/../../../public_html/',
        __DIR__ . '/../../public_html/',
        '/home/nicholas/public_html/'
    );
    foreach ($alts as $alt) {
        echo "Trying: $alt → " . (is_dir($alt) ? 'EXISTS' : 'not found') . "\n";
    }
}
?>
