<?php
/**
 * archive_folder.php
 *
 * Zips a single legacy folder from public_html and serves it for download.
 *
 * Deploy to /public_html/new/onet-v2/content/ and visit:
 *   https://www.orthodox.net/archive_folder.php?folder=poetry
 *   https://www.orthodox.net/archive_folder.php?folder=poetry&list=1  (preview files, no download)
 *
 * Security: only allows folders that exist directly under public_html.
 * Will not zip: new/, local-media/, cgi-bin/, .well-known/
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);
set_time_limit(600); // Allow up to 10 minutes for large folders

$basePath = realpath(__DIR__ . '/../../../../public_html');

// Blocked folders
$blocked = array('new', 'local-media', 'cgi-bin', '.well-known', 'dev', 'exercise',
                 'haiti', 'pentecostarion', 'seraphim', 'html5up-editorial',
                 'wpt', 'wpt-j', 'wpt-w');

if (!isset($_GET['folder'])) {
    header('Content-Type: text/html; charset=utf-8');
    echo "<h2>archive_folder.php</h2>";
    echo "<p>Usage: <code>?folder=FOLDERNAME</code> to download a zip</p>";
    echo "<p>Add <code>&list=1</code> to preview files without downloading</p>";
    echo "<p>Add <code>&batch=folder1,folder2,folder3</code> to zip multiple small folders together</p>";
    echo "<h3>Available folders:</h3><ul>";
    $dirs = scandir($basePath);
    sort($dirs);
    foreach ($dirs as $d) {
        if ($d === '.' || $d === '..') continue;
        if (!is_dir($basePath . '/' . $d)) continue;
        if (in_array($d, $blocked)) continue;
        echo "<li><a href=\"?folder=$d&list=1\">$d</a> — <a href=\"?folder=$d\">download zip</a></li>";
    }
    echo "</ul>";
    exit;
}

// Handle batch mode
if (isset($_GET['batch'])) {
    $folders = array_map('trim', explode(',', $_GET['batch']));
    $folders = array_map('basename', $folders);
} else {
    $folders = array(basename($_GET['folder']));
}

// Validate all folders
foreach ($folders as $folder) {
    if (in_array($folder, $blocked)) {
        http_response_code(403);
        echo "Folder '$folder' is blocked from archiving.";
        exit;
    }

    $folderPath = $basePath . '/' . $folder;
    if (!is_dir($folderPath)) {
        http_response_code(404);
        echo "Folder '$folder' not found.";
        exit;
    }
}

// List mode — preview files
if (isset($_GET['list'])) {
    header('Content-Type: text/html; charset=utf-8');
    foreach ($folders as $folder) {
        $folderPath = $basePath . '/' . $folder;
        echo "<h2>$folder/</h2>";
        echo "<p><a href=\"?folder=$folder\">Download zip</a></p>";
        echo "<table border=1 cellpadding=4><tr><th>File</th><th>Size</th></tr>";

        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($folderPath, RecursiveDirectoryIterator::SKIP_DOTS)
        );

        $totalSize = 0;
        $count = 0;
        foreach ($iterator as $file) {
            if ($file->isFile()) {
                $rel = str_replace($folderPath . '/', '', $file->getPathname());
                $size = $file->getSize();
                $totalSize += $size;
                $count++;
                $sizeStr = $size > 1048576 ? round($size / 1048576, 1) . ' MB' : round($size / 1024, 1) . ' KB';
                echo "<tr><td>$rel</td><td>$sizeStr</td></tr>";
            }
        }
        echo "</table>";
        echo "<p><strong>$count files, " . round($totalSize / 1048576, 2) . " MB</strong></p>";
    }
    exit;
}

// Zip and download
$zipName = count($folders) === 1 ? $folders[0] . '.zip' : 'batch_' . date('Ymd_His') . '.zip';
$zipPath = sys_get_temp_dir() . '/' . $zipName;

// Clean up any previous zip
if (file_exists($zipPath)) {
    unlink($zipPath);
}

$zip = new ZipArchive();
if ($zip->open($zipPath, ZipArchive::CREATE) !== TRUE) {
    http_response_code(500);
    echo "Failed to create zip file.";
    exit;
}

foreach ($folders as $folder) {
    $folderPath = $basePath . '/' . $folder;

    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($folderPath, RecursiveDirectoryIterator::SKIP_DOTS)
    );

    foreach ($iterator as $file) {
        if ($file->isFile()) {
            $relativePath = $folder . '/' . str_replace($folderPath . '/', '', $file->getPathname());
            $zip->addFile($file->getPathname(), $relativePath);
        }
    }
}

$zip->close();

// Serve the zip
$fileSize = filesize($zipPath);
header('Content-Type: application/zip');
header('Content-Disposition: attachment; filename="' . $zipName . '"');
header('Content-Length: ' . $fileSize);
header('Cache-Control: no-cache, must-revalidate');

readfile($zipPath);

// Clean up
unlink($zipPath);
?>
