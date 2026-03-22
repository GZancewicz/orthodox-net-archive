// Format Bible verse references in topic lists
document.addEventListener('DOMContentLoaded', function() {
    console.log('Bible verse formatter loaded');
    
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
        'romans': 'Romans', 'rom': 'Romans', 'roman': 'Romans',
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
        'apocalypse': 'Revelation',
        // Special cases with typos
        'sirach': 'Sirach'
    };
    
    // Format Bible verse text
    function formatBibleVerse(text) {
        console.log(`Attempting to format: "${text}"`);
        
        // Try multiple patterns to match Bible verses
        let patterns = [
            // Pattern 1: book + chapter.verse (e.g., "1cronicles16.14")
            /^(\d?)([a-z]+)([\d]+)[.](\d+)$/i,
            // Pattern 2: book + chapter_verse (e.g., "genesis2_15")
            /^(\d?)([a-z]+)([\d]+)[_](\d+)$/i,
            // Pattern 3: book + chapter,verse (e.g., "galations6,17")
            /^(\d?)([a-z]+)([\d]+)[,](\d+)$/i,
            // Pattern 4: book + chapter:verse (e.g., "luke21:2")
            /^(\d?)([a-z]+)([\d]+)[:](\d+)$/i
        ];
        
        for (let pattern of patterns) {
            let match = text.match(pattern);
            if (match) {
                const bookNum = match[1] || '';
                const bookName = match[2].toLowerCase();
                const chapter = match[3];
                const verse = match[4];
                
                const fullBookName = bibleBooks[bookNum + bookName];
                if (fullBookName) {
                    const formatted = `${fullBookName} ${chapter}:${verse}`;
                    console.log(`  Successfully formatted to: "${formatted}"`);
                    return formatted;
                }
            }
        }
        
        // Try patterns for verse ranges
        let rangePatterns = [
            // Pattern 5: book + chapter.verse_verse (e.g., "1thessalonians5.17_18")
            /^(\d?)([a-z]+)([\d]+)[.](\d+)[_](\d+)$/i,
            // Pattern 6: book + chapter_verse_verse (e.g., "matthew12_1_11")
            /^(\d?)([a-z]+)([\d]+)[_](\d+)[_](\d+)$/i
        ];
        
        for (let pattern of rangePatterns) {
            let match = text.match(pattern);
            if (match) {
                const bookNum = match[1] || '';
                const bookName = match[2].toLowerCase();
                const chapter = match[3];
                const verse1 = match[4];
                const verse2 = match[5];
                
                const fullBookName = bibleBooks[bookNum + bookName];
                if (fullBookName) {
                    const formatted = `${fullBookName} ${chapter}:${verse1}-${verse2}`;
                    console.log(`  Successfully formatted to: "${formatted}"`);
                    return formatted;
                }
            }
        }
        
        // Special case: Handle "Exodus20.9_10" style (capitalized)
        let match = text.match(/^([A-Z][a-z]+)([\d]+)[.](\d+)[_](\d+)$/);
        if (match) {
            const bookName = match[1].toLowerCase();
            const chapter = match[2];
            const verse1 = match[3];
            const verse2 = match[4];
            
            const fullBookName = bibleBooks[bookName];
            if (fullBookName) {
                const formatted = `${fullBookName} ${chapter}:${verse1}-${verse2}`;
                console.log(`  Successfully formatted to: "${formatted}"`);
                return formatted;
            }
        }
        
        console.log(`  No formatting applied for: "${text}"`);
        return text;
    }
    
    // Process all links on the page
    function processLinks() {
        const links = document.querySelectorAll('a[href$=".html"]');
        console.log(`Found ${links.length} links to check`);
        
        let processedCount = 0;
        links.forEach(link => {
            const href = link.getAttribute('href');
            const text = link.textContent.trim();
            
            // Only process if the text looks like it might be a Bible verse
            if (text && /^[A-Za-z0-9_,.]+$/.test(text)) {
                console.log(`Checking link: href="${href}", text="${text}"`);
                
                const formatted = formatBibleVerse(text);
                if (formatted !== text) {
                    link.textContent = formatted;
                    processedCount++;
                }
            }
        });
        
        console.log(`Processed ${processedCount} Bible verse links`);
    }
    
    // Run the formatter
    processLinks();
});