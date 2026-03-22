<?php
/**
 * generate_manifest.php
 *
 * Generates a detailed manifest of every directory and subdirectory
 * in public_html, including file counts, total size, and max file size.
 *
 * Deploy to /public_html/new/onet-v2/content/ and visit:
 *   https://www.orthodox.net/generate_manifest.php
 *
 * Returns JSON that can be saved as the manifest.
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);
set_time_limit(300); // Allow up to 5 minutes for large directories

header('Content-Type: application/json; charset=utf-8');

$basePath = realpath(__DIR__ . '/../../../../public_html');

if (!$basePath || !is_dir($basePath)) {
    echo json_encode(array('error' => 'Cannot access public_html'));
    exit;
}

// Optionally filter to a single top-level directory
$folderFilter = isset($_GET['folder']) ? basename($_GET['folder']) : null;

function scanDirectory($path, $relativePath = '') {
    $result = array(
        'path' => $relativePath ?: '.',
        'file_count' => 0,
        'total_size_bytes' => 0,
        'total_size_mb' => 0,
        'max_file_size_bytes' => 0,
        'max_file_name' => '',
        'subdirectories' => array(),
        'extensions' => array()
    );

    $items = scandir($path);
    if ($items === false) return $result;

    foreach ($items as $item) {
        if ($item === '.' || $item === '..') continue;
        $fullPath = $path . '/' . $item;
        $itemRelative = $relativePath ? $relativePath . '/' . $item : $item;

        if (is_dir($fullPath)) {
            $subResult = scanDirectory($fullPath, $itemRelative);
            $result['subdirectories'][] = $subResult;
            // Roll up counts from subdirectories
            $result['file_count'] += $subResult['file_count'];
            $result['total_size_bytes'] += $subResult['total_size_bytes'];
            if ($subResult['max_file_size_bytes'] > $result['max_file_size_bytes']) {
                $result['max_file_size_bytes'] = $subResult['max_file_size_bytes'];
                $result['max_file_name'] = $subResult['max_file_name'];
            }
        } else if (is_file($fullPath)) {
            $size = filesize($fullPath);
            $ext = strtolower(pathinfo($item, PATHINFO_EXTENSION));
            $result['file_count']++;
            $result['total_size_bytes'] += $size;
            if ($size > $result['max_file_size_bytes']) {
                $result['max_file_size_bytes'] = $size;
                $result['max_file_name'] = $itemRelative;
            }
            // Track extensions
            if (!isset($result['extensions'][$ext])) {
                $result['extensions'][$ext] = array('count' => 0, 'size_bytes' => 0);
            }
            $result['extensions'][$ext]['count']++;
            $result['extensions'][$ext]['size_bytes'] += $size;
        }
    }

    $result['total_size_mb'] = round($result['total_size_bytes'] / 1048576, 2);
    $result['max_file_size_mb'] = round($result['max_file_size_bytes'] / 1048576, 2);

    // Sort subdirectories by path
    usort($result['subdirectories'], function($a, $b) {
        return strcmp($a['path'], $b['path']);
    });

    return $result;
}

$manifest = array(
    'generated' => date('Y-m-d\TH:i:sP'),
    'server' => 'hikina.inoatech.com',
    'base_path' => '/home/nicholas/public_html',
    'directories' => array()
);

// Get top-level directories
$topDirs = scandir($basePath);
sort($topDirs);

foreach ($topDirs as $dir) {
    if ($dir === '.' || $dir === '..') continue;
    if ($folderFilter && $dir !== $folderFilter) continue;

    $fullPath = $basePath . '/' . $dir;
    if (!is_dir($fullPath)) continue;

    // Skip directories we don't want
    $skip = array('.well-known', 'cgi-bin', 'dev', 'exercise', 'haiti',
                  'pentecostarion', 'seraphim', 'html5up-editorial',
                  'wpt', 'wpt-j', 'wpt-w', 'new');
    if (in_array($dir, $skip)) continue;

    $manifest['directories'][] = scanDirectory($fullPath, $dir);
}

// Add summary
$totalFiles = 0;
$totalSize = 0;
$maxFile = 0;
$maxFileName = '';
foreach ($manifest['directories'] as $d) {
    $totalFiles += $d['file_count'];
    $totalSize += $d['total_size_bytes'];
    if ($d['max_file_size_bytes'] > $maxFile) {
        $maxFile = $d['max_file_size_bytes'];
        $maxFileName = $d['max_file_name'];
    }
}
$manifest['summary'] = array(
    'total_directories' => count($manifest['directories']),
    'total_files' => $totalFiles,
    'total_size_bytes' => $totalSize,
    'total_size_mb' => round($totalSize / 1048576, 2),
    'total_size_gb' => round($totalSize / 1073741824, 2),
    'max_file_size_bytes' => $maxFile,
    'max_file_size_mb' => round($maxFile / 1048576, 2),
    'max_file_name' => $maxFileName
);

echo json_encode($manifest, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
?>
