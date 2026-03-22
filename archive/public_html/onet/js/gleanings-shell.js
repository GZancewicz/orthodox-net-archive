// Global variable to store gleanings data
let gleaningsData = null;

// Function to load gleanings JSON data
async function loadGleaningsData() {
    if (!gleaningsData) {
        try {
            const response = await fetch('/js/gleanings-topics.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const text = await response.text();
            gleaningsData = JSON.parse(text);
        } catch (error) {
            console.error('Failed to load gleanings data:', error);
            // Try alternative path
            try {
                const response2 = await fetch('/gleanings/gleanings.json');
                if (response2.ok) {
                    gleaningsData = await response2.json();
                } else {
                    gleaningsData = [];
                }
            } catch (error2) {
                console.error('Failed to load from alternative path:', error2);
                gleaningsData = [];
            }
        }
    }
    return gleaningsData;
}

// Function to get title from JSON based on filename
async function getTitleFromJSON(fileName) {
    if (!fileName) return '';
    
    const data = await loadGleaningsData();
    const topic = data.find(item => item.link === fileName);
    
    return topic ? topic.title : '';
}

document.addEventListener('DOMContentLoaded', function() {
    // Parse URL for filename (supports both query params and path-based URLs)
    const urlParams = new URLSearchParams(window.location.search);
    let fileName = urlParams.get('file');
    
    if (!fileName) {
        const pathMatch = window.location.pathname.match(/\/gleanings\/(.+\.html)$/);
        if (pathMatch) {
            fileName = pathMatch[1];
        }
    }
    
    if (fileName) {
        // Fetch content via PHP fetcher
        fetch(`/gleanings_fetcher.php?file=${encodeURIComponent(fileName)}`)
            .then(response => response.text())
            .then(async html => {
                // Process and clean HTML
                html = await cleanLegacyHTML(html, fileName);
                
                // Get the title and prepend it to the HTML
                const title = await getTitleFromJSON(fileName);
                if (title) {
                    html = `<h4 style="text-align: center; margin: 20px 0;">${title}</h4>\n${html}`;
                }
                
                // Insert into placeholder
                document.getElementById('gleanings-placeholder').innerHTML = html;
                
                // Update page title if found
                updatePageTitle();
                
                // Format Bible verses in links
                formatBibleVerses();
                
                // Also process topics list if this is a topics page
                if (fileName === 'sub_all_topics.html' || fileName === 'sub_SUB.html') {
                    processTopicsList();
                }
            })
            .catch(error => {
                document.getElementById('gleanings-placeholder').innerHTML = 
                    '<p>Error loading content. Please try again later.</p>';
            });
    } else {
        // No file specified, check if we need to process the topics list
        // This handles the case where sub_all_topics.html is loaded in an iframe
        processTopicsList();
    }
});

// Process Bible verse links in the topics list
function processTopicsList() {
    console.log('Processing topics list for Bible verse formatting...');
    
    // Look for all links in the gleanings placeholder
    const links = document.querySelectorAll('#gleanings-placeholder a');
    console.log(`Found ${links.length} links to process`);
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        const text = link.textContent;
        
        // Only process links that look like Bible verses
        if (href && text && href.endsWith('.html')) {
            console.log(`Checking link: href="${href}", text="${text}"`);
            
            let formatted = formatBibleVerse(text);
            
            // Replace underscores with spaces
            if (formatted.includes('_')) {
                formatted = formatted.replace(/_/g, ' ');
            }
            
            // Capitalize "god" to "God" (case-insensitive)
            formatted = formatted.replace(/\bgod\b/gi, 'God');
            
            // Capitalize "orthodoxy" to "Orthodoxy" (case-insensitive)
            formatted = formatted.replace(/\borthodoxy\b/gi, 'Orthodoxy');
            
            // Capitalize "chrysostom" to "Chrysostom" (case-insensitive)
            formatted = formatted.replace(/\bchrysostom\b/gi, 'Chrysostom');
            
            // Handle specific corrections
            if (formatted.toLowerCase() === 'fromtheevergetinos' || formatted.toLowerCase() === 'fromtheevergertinos') {
                formatted = 'From the Evergetinos';
            } else if (formatted.toLowerCase() === 'avarcie') {
                formatted = 'Avarice';
            } else if (formatted.toLowerCase() === 'likeness of godf') {
                formatted = 'Likeness of God';
            } else if (formatted.toLowerCase() === 'long suffering') {
                formatted = 'Longsuffering';
            } else if (formatted.toLowerCase() === 'lords example' || formatted.toLowerCase() === 'lords passion') {
                formatted = formatted.replace(/^lords/i, "Lord's");
            } else if (formatted.toLowerCase() === 'mary:virginityof') {
                formatted = 'Virginity of Mary';
            } else if (formatted.toLowerCase() === 'matthew10 19,20' || formatted.toLowerCase() === 'matthew10 19:20') {
                formatted = 'Matthew 10:19-20';
            } else if (formatted.toLowerCase() === 'moscow patriarchate') {
                formatted = 'Moscow Patriarchate';
            } else if (formatted.toLowerCase() === 'old testament typology') {
                formatted = 'Old Testament Typology';
            } else if (formatted.toLowerCase() === 'passions the 8 passions') {
                formatted = 'The 8 Passions';
            } else if (formatted.toLowerCase() === 'poemen abbacat:purity') {
                formatted = 'Abba Poemen on Purity';
            } else if (formatted.toLowerCase() === 'scripture:gospels:luke17:10') {
                formatted = 'Luke 17:10';
            } else if (formatted === 'Sirach28.13' || formatted === 'Sirach28:13') {
                formatted = 'Sirach 28:13';
            } else if (formatted.toLowerCase() === 'stjohnclimacus') {
                formatted = 'St. John Climacus';
            } else if (formatted.toLowerCase() === 'virtues the 4 virtues') {
                formatted = 'The Four Virtues';
            }
            
            if (formatted !== text) {
                console.log(`  Formatting: "${text}" -> "${formatted}"`);
                link.textContent = formatted;
            }
        }
    });
}

async function cleanLegacyHTML(html, fileName) {
    // Get the title from JSON data
    const formattedTitle = await getTitleFromJSON(fileName);
    console.log('File:', fileName, 'Title from JSON:', formattedTitle);
    
    // Get the topic data to check if it's a person
    const data = await loadGleaningsData();
    const topic = data.find(item => item.link === fileName);
    const isPerson = topic && topic.person === 'yes';
    
    // Remove consecutive spaces and nbsp
    html = html.replace(/(&nbsp;|\s)+/g, ' ');
    
    // Remove [U*] artifacts
    html = html.replace(/\[U\*\]/g, '');
    
    // Unwrap font tags
    html = html.replace(/<font[^>]*>(.*?)<\/font>/gi, '$1');
    
    // Fix broken URLs
    html = html.replace(/http:\/\/www\.orthodox\.net\/\//g, '/');
    html = html.replace(/\/\//g, '/');
    
    // Convert relative media links to absolute production URLs
    html = html.replace(/href="([^"]*\.(mp3|pdf|doc|docx|rtf))"/gi, 
        'href="https://www.orthodox.net/gleanings/$1"');
    
    // Fix relative links to other sections
    html = html.replace(/href="\.\.\/sermons\//gi, 'href="/sermons/');
    html = html.replace(/href="\.\.\/questions\//gi, 'href="/questions/');
    html = html.replace(/href="\.\.\/ustav\//gi, 'href="/ustav/');
    html = html.replace(/href="\.\.\/aboutus\//gi, 'href="/aboutus/');
    
    // Fix image sources - handle both quoted and unquoted attributes
    
    // NOTE: If you encounter malformed image tags like: src="" ..="" folder="" filename""=""
    // Add a specific fix here like:
    // html = html.replace(/src=""\s+\.\.=""\s+(\w+)=""\s+([^"]+)""=""/gi, 
    //     'src="https://www.orthodox.net/$1/$2"');
    
    // First, normalize all unquoted src attributes to quoted ones
    html = html.replace(/src=([^\s>]+)/gi, 'src="$1"');
    
    // Now fix all src attributes with ../
    html = html.replace(/src="\.\.\/([^"]+)"/gi, 'src="https://www.orthodox.net/$1"');
    
    // Fix src with just filename (no path) - but not if already absolute
    html = html.replace(/src="([^"]+)"/gi, function(match, url) {
        // Skip if already absolute or starts with /
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
            return match;
        }
        // Skip if it contains ../ (already handled above)
        if (url.includes('../')) {
            return match;
        }
        // Only convert if it's a simple filename with image extension
        if (url.match(/^[^\/]+\.(gif|jpg|jpeg|png|webp)$/i)) {
            return 'src="https://www.orthodox.net/gleanings/' + url + '"';
        }
        return match;
    });
    
    html = html.replace(/href="\.\.\/([^"]+)"/gi, function(match, path) {
        // Don't convert if it's already been converted to an absolute path
        if (path.startsWith('http')) {
            return match;
        }
        // Don't convert anchors
        if (path.startsWith('#')) {
            return match;
        }
        return 'href="https://www.orthodox.net/' + path + '"';
    });
    
    // Remove empty paragraphs
    html = html.replace(/<p[^>]*>[\s&nbsp;]*<\/p>/gi, '');
    
    // Remove "In Categories:" headings BEFORE remapping (while they're still h3)
    html = html.replace(/<h3[^>]*>\s*In\s+Categories:\s*[^<]*<\/h3>/gi, '');
    
    // Remap heading hierarchy
    html = html.replace(/<h1/gi, '<h3');
    html = html.replace(/<\/h1>/gi, '</h3>');
    
    // Insert the title RIGHT AFTER h1->h3 conversion, BEFORE h3->h5 conversion
    if (formattedTitle) {
        console.log('Attempting to insert title:', formattedTitle);
        
        // Check if the pattern exists
        const hasPattern = html.includes('Gleanings from Orthodox Christian Authors and the Holy Fathers</h3>');
        console.log('Pattern found:', hasPattern);
        
        // Log a snippet of the HTML to see what we're working with
        const h3Match = html.match(/<h3[^>]*>.*?<\/h3>/i);
        if (h3Match) {
            console.log('First h3 found:', h3Match[0]);
        }
        
        // Just find where the main heading ends and insert the title after it
        // Handle both & and &amp; in the pattern
        const newHtml = html.replace(/(Gleanings from Orthodox Christian Authors (?:and|&amp;|&) the Holy Fathers<\/h3>)/i, `$1\n<h4 style="text-align: center;">${formattedTitle}</h4>`);
        
        if (newHtml === html) {
            console.error('Title insertion failed - no replacement made');
        } else {
            console.log('Title successfully inserted');
        }
        
        html = newHtml;
    }
    
    // FIRST: Remove the original h2 tag with the filename before converting it
    // Extract just the filename without extension
    const fileBaseName = fileName ? fileName.replace('.html', '') : '';
    if (fileBaseName) {
        // Remove h2 tags that exactly match the filename (case-insensitive)
        const filenamePattern = new RegExp(`<h2[^>]*>\\s*${fileBaseName}\\s*</h2>`, 'gi');
        html = html.replace(filenamePattern, '');
    }
    
    html = html.replace(/<h2/gi, '<h4');
    html = html.replace(/<\/h2>/gi, '</h4>');
    html = html.replace(/<h[3-6]/gi, '<h5');
    html = html.replace(/<\/h[3-6]>/gi, '</h5>');
    
    // Remove specific h4 patterns that are filenames
    // First, remove any h4 that has underscores (like naaman_the_syrian, moses_the_ethiopian)
    html = html.replace(/<h4[^>]*>\s*\w+_[\w_]+\s*<\/h4>/gi, '');
    
    // Then remove single-word lowercase h4 tags that appear right after the main title
    // This catches cases like "moses", "sisoes", etc. BUT NOT our inserted title
    // Update pattern to handle &amp; and make sure we don't remove titles that start with capital letters
    html = html.replace(/(<h3[^>]*>Gleanings from Orthodox Christian Authors (?:and|&amp;|&) the Holy Fathers<\/h3>[\s\S]{0,100})<h4[^>]*>\s*[a-z][a-z]*\s*<\/h4>/gi, '$1');
    
    // IMPORTANT: Also remove h5 tags that contain the filename pattern
    // After all the heading remapping, some h2/h3 tags become h5
    html = html.replace(/<h5[^>]*>\s*\w+_[\w_]+\s*<\/h5>/gi, '');
    html = html.replace(/<h5[^>]*>\s*[a-z][a-z0-9_\-]*\s*<\/h5>/gi, '');
    
    // Remove "X Entries" headings (like "5 Entries", "9 Entries", etc.)
    html = html.replace(/<h[3-5][^>]*>\s*\d+\s+Entr(y|ies)\s*<\/h[3-5]>/gi, '');
    
    // If this is a person page, remove all attribution content early
    if (isPerson) {
        // Remove everything from <HR> to the end
        html = html.replace(/<HR[^>]*>[\s\S]*/gi, '');
        
        // Remove any SPAN class=n tags which often contain attributions
        html = html.replace(/<SPAN\s+class\s*=\s*n[^>]*>[\s\S]*?<\/SPAN>/gi, '');
        
        // Exit early - no need to process attributions for person pages
        // Skip all the attribution processing below
    } else {
    
    // Replace "Sr. Benedicta Ward" references with "The Desert Fathers"
    // This regex finds text starting with Sr. Benedicta Ward and removes everything up to <HR>
    html = html.replace(/Sr\.\s*Benedicta\s*Ward[^<]*(?:<[^>]+>[^<]*)*?(?=<HR)/gi, '<br><br>The Desert Fathers');
    
    // Replace "The Wisdom of the Desert" with "The Desert Fathers" and add blank line
    html = html.replace(/(?:<br\s*\/?>)*\s*The\s+Wisdom\s+of\s+the\s+Desert[^<\n]*/gi, '<br><br>The Desert Fathers');
    
    // Remove quotes around "The Desert Fathers" if present
    html = html.replace(/"The\s+Desert\s+Fathers"/gi, 'The Desert Fathers');
    
    // Clean up "The Desert Fathers" - remove any attribution text on the same line
    html = html.replace(/The\s+Desert\s+Fathers[^<\n]*/gi, 'The Desert Fathers');
    
    // Ensure "The Desert Fathers" always has a blank line before it (if not already)
    // First, remove any existing line breaks immediately before it
    html = html.replace(/(<br\s*\/?>)*\s*The Desert Fathers/gi, '<br><br>The Desert Fathers');
    
    // Remove "Venerable Bessarion the Egyptian, commemorated 6 June" and similar commemorative texts
    html = html.replace(/Venerable\s+Bessarion\s+the\s+Egyptian,\s*commemorated\s+\d+\s+\w+/gi, '');
    
    // Remove "Abba Nilus, in "The Sayings of The Desert Fathers," (in" and similar attributions
    html = html.replace(/Abba\s+Nilus,\s*in\s*"The\s+Sayings\s+of\s*(?:<br\s*\/?>)*\s*The\s+Desert\s+Fathers,"\s*\(in/gi, '');
    
    // Fix "the Coptic Life of St. Onnophrius" - capitalize "The" and add blank line before
    html = html.replace(/(?:<br\s*\/?>)*\s*the\s+Coptic\s+Life\s+of\s+St\.\s*Onnophrius\s*\(comm\s*\d+\s*\w+\)\s*by\s*Paphnutius/gi, 
        '<br><br>The Coptic Life of St. Onnophrius (comm 13 June) by Paphnutius');
    
    // Handle "REF:" - remove it and add blank line before the reference
    html = html.replace(/REF:\s*/gi, '<br><br>');
    
    // Replace St Anthony the Great Philokalia reference with just "Philokalia" and add blank line
    html = html.replace(/St\s+Anthony\s+the\s+Great,\s*"Early\s+Fathers\s+From\s+the\s+Philokalia,"\s*by\s+E\.\s*Kadloubovsky\s+and\s+G\.E\.H\.\s*Palmer,\s*\([^)]*\),\s*pp\.\s*[\d\-]+/gi, '<br><br>Philokalia');
    
    // Ensure "Philokalia" always has a blank line before it
    html = html.replace(/(?:<br\s*\/?>)*\s*Philokalia/g, '<br><br>Philokalia');
    
    // Remove commemorative text from Athanasius reference and add blank line before
    html = html.replace(/(?:<br\s*\/?>)*\s*(Athanasius,\s*Life\s+of\s+St\.\s*Antony\s+[\d\.\-]+)\s+St\.\s*Antony\s+the\s+Great,\s*commemorated\s+\d+\s+\w+/gi, '<br><br>$1');
    
    // Replace REF entries with Velimirovic and Prologue
    html = html.replace(/REF:[^<\n]*Velimirovic[^<\n]*Prologue[^<\n]*/gi, '<br><br>St. Nikolai Velimirovic, "The Prologue"');
    
    // Replace any Velimirovic Prologue citations with standardized format
    html = html.replace(/(?:Bishop\s+)?Nikolai\s+Velimirovic,\s*"The\s+Prologue[^"]*"[^<\n]*/gi, '<br><br>St. Nikolai Velimirovic, "The Prologue"');
    
    } // End of else block - only process attributions for non-person pages
    
    // Center all headings
    html = html.replace(/<h([3-5])/gi, '<h$1 style="text-align: center;"');
    
    // Remove all style tags and inline styles (except centering)
    html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    html = html.replace(/style="[^"]*"/gi, function(match) {
        if (match.includes('text-align: center')) {
            return 'style="text-align: center;"';
        }
        return '';
    });
    
    // Add proper styling to images that are aligned left or right
    html = html.replace(/<img([^>]*?)align="?left"?([^>]*?)>/gi, function(match, before, after) {
        // Remove any existing align attribute and add style
        var cleaned = (before + after).replace(/align="?left"?/gi, '');
        return '<img' + cleaned + ' style="float: left; margin: 0 15px 15px 0;">';
    });
    
    html = html.replace(/<img([^>]*?)align="?right"?([^>]*?)>/gi, function(match, before, after) {
        // Remove any existing align attribute and add style
        var cleaned = (before + after).replace(/align="?right"?/gi, '');
        return '<img' + cleaned + ' style="float: right; margin: 0 0 15px 15px;">';
    });
    
    // Remove old class attributes that might conflict
    html = html.replace(/class="[^"]*"/gi, '');
    
    // Fix character encoding issues
    html = html.replace(/â€™/g, "'");
    html = html.replace(/â€œ/g, '"');
    html = html.replace(/â€/g, '"');
    html = html.replace(/â€"/g, '—');
    html = html.replace(/â€¦/g, '...');
    
    return html;
}

function updatePageTitle() {
    const h3 = document.querySelector('#gleanings-placeholder h3');
    if (h3) {
        document.title = h3.textContent + ' - St. Nicholas Orthodox Church';
    }
}

// Function to insert the page title after DOM is loaded
async function insertPageTitle(fileName) {
    if (!fileName) return;
    
    // Get the title from JSON
    const title = await getTitleFromJSON(fileName);
    if (!title) return;
    
    // Find the main heading - it's outside the placeholder
    const allH3 = document.querySelectorAll('h3');
    console.log('Found', allH3.length, 'h3 elements');
    allH3.forEach((h3, index) => {
        console.log(`h3[${index}]:`, h3.textContent.trim());
    });
    
    const mainHeading = Array.from(allH3).find(h3 => 
        h3.textContent.includes('Gleanings from Orthodox Christian Authors')
    );
    
    if (!mainHeading) {
        console.log('Main heading not found');
        return;
    }
    
    // Check if title already exists
    const nextElement = mainHeading.nextElementSibling;
    if (nextElement && nextElement.tagName === 'H4' && nextElement.textContent === title) {
        return; // Title already exists
    }
    
    // Create and insert the title
    const titleElement = document.createElement('h4');
    titleElement.textContent = title;
    titleElement.style.textAlign = 'center';
    titleElement.style.color = 'black';
    titleElement.style.display = 'block';
    titleElement.style.margin = '20px 0';
    titleElement.style.fontSize = '1.5em';
    
    // Insert after the main heading
    mainHeading.parentNode.insertBefore(titleElement, mainHeading.nextSibling);
    
    console.log('Title inserted via DOM manipulation:', title);
    
    // Double-check it's really there
    setTimeout(() => {
        const insertedTitle = document.querySelector('#gleanings-placeholder h4');
        if (insertedTitle) {
            console.log('Title element found in DOM:', insertedTitle.textContent);
            console.log('Title element visible:', insertedTitle.offsetHeight > 0);
        } else {
            console.log('Title element NOT found in DOM!');
        }
    }, 100);
}

// Format a single Bible verse text
function formatBibleVerse(text) {
    // Bible book mapping
    const bibleBooks = {
        // Old Testament
        'genesis': 'Genesis', 'gen': 'Genesis',
        'exodus': 'Exodus', 'exod': 'Exodus',
        'leviticus': 'Leviticus', 'lev': 'Leviticus',
        'numbers': 'Numbers', 'num': 'Numbers',
        'deuteronomy': 'Deuteronomy', 'deut': 'Deuteronomy',
        'joshua': 'Joshua', 'josh': 'Joshua',
        'judges': 'Judges', 'judg': 'Judges',
        'ruth': 'Ruth',
        '1samuel': '1 Samuel', '1sam': '1 Samuel',
        '2samuel': '2 Samuel', '2sam': '2 Samuel',
        '1kings': '1 Kings', '1kgs': '1 Kings',
        '2kings': '2 Kings', '2kgs': '2 Kings',
        '1chronicles': '1 Chronicles', '1chron': '1 Chronicles', '1cronicles': '1 Chronicles',
        '2chronicles': '2 Chronicles', '2chron': '2 Chronicles', '2cronicles': '2 Chronicles',
        'ezra': 'Ezra',
        'nehemiah': 'Nehemiah', 'neh': 'Nehemiah',
        'esther': 'Esther',
        'job': 'Job',
        'psalms': 'Psalms', 'psalm': 'Psalms', 'ps': 'Psalms',
        'proverbs': 'Proverbs', 'prov': 'Proverbs',
        'ecclesiastes': 'Ecclesiastes', 'eccl': 'Ecclesiastes',
        'songofsolomon': 'Song of Solomon', 'song': 'Song of Solomon',
        'isaiah': 'Isaiah', 'isa': 'Isaiah',
        'jeremiah': 'Jeremiah', 'jer': 'Jeremiah',
        'lamentations': 'Lamentations', 'lam': 'Lamentations',
        'ezekiel': 'Ezekiel', 'ezek': 'Ezekiel',
        'daniel': 'Daniel', 'dan': 'Daniel',
        'hosea': 'Hosea', 'hos': 'Hosea',
        'joel': 'Joel',
        'amos': 'Amos',
        'obadiah': 'Obadiah', 'obad': 'Obadiah',
        'jonah': 'Jonah',
        'micah': 'Micah', 'mic': 'Micah',
        'nahum': 'Nahum', 'nah': 'Nahum',
        'habakkuk': 'Habakkuk', 'hab': 'Habakkuk',
        'zephaniah': 'Zephaniah', 'zeph': 'Zephaniah',
        'haggai': 'Haggai', 'hag': 'Haggai',
        'zechariah': 'Zechariah', 'zech': 'Zechariah',
        'malachi': 'Malachi', 'mal': 'Malachi',
        // New Testament
        'matthew': 'Matthew', 'matt': 'Matthew', 'mt': 'Matthew',
        'mark': 'Mark', 'mk': 'Mark',
        'luke': 'Luke', 'lk': 'Luke',
        'john': 'John', 'jn': 'John',
        'acts': 'Acts',
        'romans': 'Romans', 'rom': 'Romans',
        '1corinthians': '1 Corinthians', '1cor': '1 Corinthians', 'icorinthians': '1 Corinthians',
        '2corinthians': '2 Corinthians', '2cor': '2 Corinthians',
        'galatians': 'Galatians', 'gal': 'Galatians', 'galations': 'Galatians',
        'ephesians': 'Ephesians', 'eph': 'Ephesians',
        'philippians': 'Philippians', 'phil': 'Philippians',
        'colossians': 'Colossians', 'col': 'Colossians',
        '1thessalonians': '1 Thessalonians', '1thess': '1 Thessalonians',
        '2thessalonians': '2 Thessalonians', '2thess': '2 Thessalonians',
        '1timothy': '1 Timothy', '1tim': '1 Timothy',
        '2timothy': '2 Timothy', '2tim': '2 Timothy',
        'titus': 'Titus',
        'philemon': 'Philemon', 'phlm': 'Philemon',
        'hebrews': 'Hebrews', 'heb': 'Hebrews',
        'james': 'James', 'jas': 'James',
        '1peter': '1 Peter', '1pet': '1 Peter',
        '2peter': '2 Peter', '2pet': '2 Peter',
        '1john': '1 John', '1jn': '1 John',
        '2john': '2 John', '2jn': '2 John',
        '3john': '3 John', '3jn': '3 John',
        'jude': 'Jude',
        'revelation': 'Revelation', 'rev': 'Revelation',
        'apocalypse': 'Revelation'
    };
    
    // Try to match Bible verse pattern - handle various separators
    
    // First handle special cases with spaces in book names (e.g., "John 12,25")
    let verseMatch = text.match(/^([a-z]+)\s+(\d+)[,:]([\d]+)$/i);
    if (verseMatch) {
        const bookName = verseMatch[1].toLowerCase();
        const chapter = verseMatch[2];
        const verse = verseMatch[3];
        
        const fullBookName = bibleBooks[bookName];
        if (fullBookName) {
            return `${fullBookName} ${chapter}:${verse}`;
        }
    }
    
    // Pattern 1: verse ranges with space (e.g., "1thessalonians5.17 18" or "Exodus20.9 10")
    verseMatch = text.match(/^(\d?)([a-z]+)([\d]+)[.:_,]?([\d]+)\s+([\d]+)$/i);
    if (verseMatch) {
        const bookNum = verseMatch[1] || '';
        const bookName = verseMatch[2].toLowerCase();
        const chapter = verseMatch[3];
        const verse1 = verseMatch[4];
        const verse2 = verseMatch[5];
        
        const fullBookName = bibleBooks[bookNum + bookName];
        if (fullBookName) {
            return `${fullBookName} ${chapter}:${verse1}-${verse2}`;
        }
    }
    
    // Pattern 2: single verse with various separators (including comma)
    verseMatch = text.match(/^(\d?)([a-z]+)([\d]+)[.:_,]([\d]+)$/i);
    if (verseMatch) {
        const bookNum = verseMatch[1] || '';
        const bookName = verseMatch[2].toLowerCase();
        const chapter = verseMatch[3];
        const verse = verseMatch[4];
        
        const fullBookName = bibleBooks[bookNum + bookName];
        if (fullBookName) {
            return `${fullBookName} ${chapter}:${verse}`;
        }
    }
    
    // Pattern 3: chapter only (no verse)
    verseMatch = text.match(/^(\d?)([a-z]+)([\d]+)$/i);
    if (verseMatch) {
        const bookNum = verseMatch[1] || '';
        const bookName = verseMatch[2].toLowerCase();
        const chapter = verseMatch[3];
        
        const fullBookName = bibleBooks[bookNum + bookName];
        if (fullBookName) {
            return `${fullBookName} ${chapter}`;
        }
    }
    
    return text; // Return unchanged if not a Bible verse
}

function formatBibleVerses() {
    console.log('formatBibleVerses called');
    
    // Find all links in the content
    const links = document.querySelectorAll('#gleanings-placeholder a');
    
    links.forEach(link => {
        const text = link.textContent;
        let formatted = formatBibleVerse(text);
        
        // Replace underscores with spaces
        if (formatted.includes('_')) {
            formatted = formatted.replace(/_/g, ' ');
        }
        
        // Capitalize "god" to "God" (case-insensitive)
        formatted = formatted.replace(/\bgod\b/gi, 'God');
        
        // Handle "fromtheevergetinos" -> "From the Evergetinos"
        if (formatted.toLowerCase() === 'fromtheevergetinos') {
            formatted = 'From the Evergetinos';
        }
        
        if (formatted !== text) {
            link.textContent = formatted;
        }
    });
}
