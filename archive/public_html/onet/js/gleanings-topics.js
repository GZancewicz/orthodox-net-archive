document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the gleanings index or sub_all_topics page
    const path = window.location.pathname.toLowerCase();
    if (!path.includes('gleanings/index') && 
        !path.includes('sub_all_topics') &&
        !path.endsWith('gleanings/') &&
        !path.match(/gleanings\/?$/)) {
        console.log('Gleanings script: Not on gleanings page, skipping. Path:', window.location.pathname);
        return;
    }
    console.log('Gleanings script: Loading topics for path:', window.location.pathname);
    
    // Find the container where topics should be loaded
    const container = document.querySelector('.section-links .twelve.columns');
    if (!container) {
        console.error('Topics container not found');
        return;
    }
    
    // Show loading message
    container.innerHTML = '<p>Loading topics...</p>';
    
    // Load the JSON file - use relative path for local development
    const jsonPath = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:' 
        ? '../js/gleanings-topics.json' 
        : '/js/gleanings-topics.json';
    console.log('Fetching topics from:', jsonPath);
    fetch(jsonPath)
        .then(response => {
            console.log('Topics fetch response:', response.status, response.statusText);
            if (!response.ok) {
                throw new Error(`Failed to load topics: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(topics => {
            // Filter out topics that start with "Gleanings-" and other unwanted entries
            const filteredTopics = topics.filter(topic => {
                // Exclude Gleanings- entries
                if (topic.title.startsWith('Gleanings-')) return false;
                // Exclude specific entries
                if (topic.title === 'Ha') return false;
                if (topic.title === 'Index-Ssi') return false;
                if (topic.title === 'Sub Sub') return false;
                return true;
            });
            
            // Handle duplicates - add numbers to duplicate titles
            const titleCounts = {};
            const processedTopics = filteredTopics.map(topic => {
                const baseTitle = topic.title;
                
                // Count occurrences of this title
                if (!titleCounts[baseTitle]) {
                    titleCounts[baseTitle] = { count: 0, current: 0 };
                }
                titleCounts[baseTitle].count++;
                
                return { ...topic };
            });
            
            // Second pass - add numbers to duplicates
            processedTopics.forEach(topic => {
                const baseTitle = topic.title;
                if (titleCounts[baseTitle].count > 1) {
                    titleCounts[baseTitle].current++;
                    topic.displayTitle = `${baseTitle} (${titleCounts[baseTitle].current})`;
                } else {
                    topic.displayTitle = baseTitle;
                }
            });
            
            // Separate scripture, person, and other topics
            const scriptureTopics = processedTopics.filter(topic => topic.scripture === 'yes');
            const personTopics = processedTopics.filter(topic => topic.person === 'yes');
            const nonScriptureNonPersonTopics = processedTopics.filter(topic => topic.scripture !== 'yes' && topic.person !== 'yes');
            
            // Organize topics by category
            const categorizedTopics = {
                "Prayer & Worship": [],
                "Virtues": [],
                "Sins & Passions": [],
                "Spiritual Struggle": [],
                "Daily Christian Life": [],
                "Theology & Doctrine": [],
                "Feasts & Saints": [],
                "Monasticism": [],
                "Other Topics": []
            };
            
            // Categorize each topic
            nonScriptureNonPersonTopics.forEach(topic => {
                const category = categorizeTopic(topic.title);
                categorizedTopics[category].push(topic);
            });
            
            // Store all topics for search functionality
            const allTopics = [
                ...nonScriptureNonPersonTopics,
                ...personTopics.map(t => ({...t, category: 'About Specific Persons'})),
                ...scriptureTopics.map(t => ({...t, category: 'Scripture References'}))
            ];
            
            // Build HTML with search and collapsible categories
            let html = '';
            
            // Add search box
            html += `
                <div class="search-container" style="margin-bottom: 20px;">
                    <input type="text" 
                           id="gleanings-search" 
                           placeholder="Type to search topics..." 
                           style="width: 100%; max-width: 400px; padding: 8px 12px; font-size: 15px; border: 1px solid #d5d5d5; border-radius: 5px; background: #f0f0f0;">
                    <div id="search-results" style="display: none; margin-top: 8px; padding: 10px 12px; background: #efefef; border: 1px solid #ddd; border-radius: 5px; max-width: 500px;">
                        <div id="search-results-content"></div>
                    </div>
                </div>
            `;
            
            // Add CSS for collapsible sections and search if not already added
            if (!document.getElementById('gleanings-collapsible-styles')) {
                const style = document.createElement('style');
                style.id = 'gleanings-collapsible-styles';
                style.innerHTML = `
                    .category-header {
                        background: #e8e8e8;
                        padding: 12px 15px;
                        margin: 10px 0 0 0;
                        cursor: pointer;
                        border-radius: 5px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        transition: background-color 0.3s;
                        font-size: 1.1em;
                        font-weight: 600;
                    }
                    .category-header:hover {
                        background: #dedede;
                    }
                    .category-header.active {
                        background: #d5d5d5;
                        border-radius: 5px 5px 0 0;
                    }
                    .category-count {
                        font-size: 0.9em;
                        color: #666;
                        font-weight: normal;
                    }
                    .category-arrow {
                        transition: transform 0.3s;
                        font-size: 0.8em;
                    }
                    .category-header.active .category-arrow {
                        transform: rotate(90deg);
                    }
                    .category-content {
                        display: none;
                        padding: 10px 15px;
                        background: #d8d8d8;
                        border-radius: 0 0 5px 5px;
                        margin: 0 0 10px 0;
                    }
                    .category-content.active {
                        display: block;
                    }
                    .category-content ul {
                        margin: 0;
                        columns: 1;
                    }
                    @media (min-width: 768px) {
                        .category-content ul {
                            columns: 2;
                            column-gap: 30px;
                        }
                    }
                    .category-content li {
                        break-inside: avoid;
                        margin-bottom: 5px;
                    }
                    .search-result-category {
                        font-size: 0.9em;
                        color: #666;
                        margin-left: 10px;
                    }
                    #search-results ul {
                        list-style: none;
                        padding: 0;
                        margin: 0;
                    }
                    #search-results li {
                        padding: 4px 0;
                        font-size: 0.95em;
                    }
                    .categories-section {
                        transition: opacity 0.3s;
                    }
                    .categories-section.dimmed {
                        opacity: 0.3;
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Wrap categories in a div for dimming during search
            html += '<div class="categories-section">';
            
            // Display each category as collapsible
            for (const [category, topicsList] of Object.entries(categorizedTopics)) {
                if (topicsList.length > 0) {
                    // Sort topics alphabetically within category
                    topicsList.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
                    
                    const categoryId = category.toLowerCase().replace(/[^a-z0-9]/g, '-');
                    
                    html += `
                        <div class="category-section">
                            <div class="category-header" data-category="${categoryId}">
                                <span>${category} <span class="category-count">(${topicsList.length} topics)</span></span>
                                <span class="category-arrow">&#9654;</span>
                            </div>
                            <div class="category-content" id="content-${categoryId}">
                                <ul>`;
                    
                    topicsList.forEach(topic => {
                        html += `<li><a href="${topic.link}">${topic.displayTitle}</a></li>`;
                    });
                    
                    html += `
                                </ul>
                            </div>
                        </div>`;
                }
            }
            
            // Add horizontal rule and persons section (also collapsible)
            html += '<hr>\n';
            
            // Sort persons alphabetically
            const sortedPersons = personTopics.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
            
            if (sortedPersons.length > 0) {
                html += `
                    <div class="category-section">
                        <div class="category-header" data-category="persons">
                            <span>About Specific Persons <span class="category-count">(${sortedPersons.length} persons)</span>
                            <span id="attribution-asterisk" title="Click for more information" style="cursor: pointer; color: #666; font-size: 0.8em;"> *</span></span>
                            <span class="category-arrow">&#9654;</span>
                        </div>
                        <div class="category-content" id="content-persons">
                            <ul>`;
                
                sortedPersons.forEach(topic => {
                    html += `<li><a href="${topic.link}">${topic.displayTitle}</a></li>`;
                });
                
                html += `
                            </ul>
                        </div>
                    </div>`;
            }
            
            // Add scripture section (also collapsible)
            html += '<hr>\n';
            
            // Define book order (Septuagint for OT)
            const oldTestamentOrder = [
                'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
                'Joshua', 'Judges', 'Ruth', '1 Kingdoms (1 Samuel)', '2 Kingdoms (2 Samuel)', 
                '3 Kingdoms (1 Kings)', '4 Kingdoms (2 Kings)',
                '1 Chronicles', '2 Chronicles', '1 Esdras', '2 Esdras', 'Ezra', 'Nehemiah',
                'Tobit', 'Judith', 'Esther', '1 Maccabees', '2 Maccabees', '3 Maccabees', '4 Maccabees',
                'Psalm', 'Job', 'Proverbs', 'Ecclesiastes', 'Song of Solomon', 
                'Wisdom', 'Sirach', 'Hosea', 'Amos', 'Micah', 'Joel', 'Obadiah', 'Jonah',
                'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
                'Isaiah', 'Jeremiah', 'Baruch', 'Lamentations', 'Letter of Jeremiah',
                'Ezekiel', 'Daniel'
            ];
            
            const newTestamentOrder = [
                'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans',
                '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
                'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
                '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews',
                'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John',
                'Jude', 'Revelation'
            ];
            
            // Function to get book name from title
            const getBookName = (title) => {
                for (const book of [...oldTestamentOrder, ...newTestamentOrder]) {
                    if (title.startsWith(book + ' ') || title === book) {
                        return book;
                    }
                }
                return title; // fallback
            };
            
            // Function to get chapter and verse numbers for sorting
            const getChapterVerse = (title) => {
                const match = title.match(/(\d+):?(\d*)[-–]?(\d*)/);
                if (match) {
                    return {
                        chapter: parseInt(match[1]) || 0,
                        verseStart: parseInt(match[2]) || 0,
                        verseEnd: parseInt(match[3]) || parseInt(match[2]) || 0
                    };
                }
                return { chapter: 0, verseStart: 0, verseEnd: 0 };
            };
            
            // Sorting function
            const sortScripture = (a, b, bookOrder) => {
                const bookA = getBookName(a.title);
                const bookB = getBookName(b.title);
                const indexA = bookOrder.indexOf(bookA);
                const indexB = bookOrder.indexOf(bookB);
                
                // Sort by book order first
                if (indexA !== indexB) {
                    // If one is not found, put it at the end
                    if (indexA === -1) return 1;
                    if (indexB === -1) return -1;
                    return indexA - indexB;
                }
                
                // Same book, sort by chapter and verse
                const numsA = getChapterVerse(a.title);
                const numsB = getChapterVerse(b.title);
                
                if (numsA.chapter !== numsB.chapter) {
                    return numsA.chapter - numsB.chapter;
                }
                
                return numsA.verseStart - numsB.verseStart;
            };
            
            // Separate and sort Old and New Testament
            const oldTestament = scriptureTopics
                .filter(topic => topic.testament === 'old')
                .sort((a, b) => sortScripture(a, b, oldTestamentOrder));
                
            const newTestament = scriptureTopics
                .filter(topic => topic.testament === 'new')
                .sort((a, b) => sortScripture(a, b, newTestamentOrder));
            
            // Scripture section (collapsible)
            html += `
                <div class="category-section">
                    <div class="category-header" data-category="scripture">
                        <span>Scripture References <span class="category-count">(${scriptureTopics.length} references)</span></span>
                        <span class="category-arrow">&#9654;</span>
                    </div>
                    <div class="category-content" id="content-scripture">
                        <div class="row">`;
            
            // New Testament in left column
            html += '<div class="six columns">';
            if (newTestament.length > 0) {
                html += '<h5>New Testament</h5><ul>';
                newTestament.forEach(topic => {
                    html += `<li><a href="${topic.link}">${topic.displayTitle}</a></li>`;
                });
                html += '</ul>';
            }
            html += '</div>';
            
            // Old Testament in right column
            html += '<div class="six columns">';
            if (oldTestament.length > 0) {
                html += '<h5>Old Testament</h5><ul>';
                oldTestament.forEach(topic => {
                    html += `<li><a href="${topic.link}">${topic.displayTitle}</a></li>`;
                });
                html += '</ul>';
            }
            html += '</div>';
            
            html += `
                        </div>
                    </div>
                </div>`;
            
            // Close the categories section div
            html += '</div>';
            
            // Insert the HTML
            container.innerHTML = html;
            
            // Add click handlers for collapsible sections
            document.querySelectorAll('.category-header').forEach(header => {
                header.addEventListener('click', function(e) {
                    // Don't toggle if clicking on the asterisk
                    if (e.target.id === 'attribution-asterisk') {
                        return;
                    }
                    
                    const categoryId = this.getAttribute('data-category');
                    const content = document.getElementById(`content-${categoryId}`);
                    
                    // Toggle active class
                    this.classList.toggle('active');
                    content.classList.toggle('active');
                });
            });
            
            // Add search functionality
            const searchInput = document.getElementById('gleanings-search');
            const searchResults = document.getElementById('search-results');
            const searchResultsContent = document.getElementById('search-results-content');
            const categoriesSection = document.querySelector('.categories-section');
            
            // Add category to non-categorized topics for search display
            allTopics.forEach(topic => {
                if (!topic.category) {
                    topic.category = categorizeTopic(topic.title);
                }
            });
            
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase().trim();
                
                if (searchTerm.length < 2) {
                    // Hide search results if less than 2 characters
                    searchResults.style.display = 'none';
                    categoriesSection.classList.remove('dimmed');
                    return;
                }
                
                // Filter topics that match the search term
                const matches = allTopics.filter(topic => 
                    topic.title.toLowerCase().includes(searchTerm) ||
                    (topic.displayTitle && topic.displayTitle.toLowerCase().includes(searchTerm))
                );
                
                if (matches.length > 0) {
                    // Sort matches by how early the search term appears
                    matches.sort((a, b) => {
                        const aIndex = a.title.toLowerCase().indexOf(searchTerm);
                        const bIndex = b.title.toLowerCase().indexOf(searchTerm);
                        if (aIndex !== bIndex) return aIndex - bIndex;
                        return a.title.localeCompare(b.title);
                    });
                    
                    // Limit to first 20 results for performance
                    const limitedMatches = matches.slice(0, 20);
                    
                    // Build search results HTML
                    let resultsHTML = `<div style="font-size: 0.85em; color: #666; margin-bottom: 8px;">${matches.length} found${matches.length > 20 ? ', showing 20' : ''}</div><ul>`;
                    limitedMatches.forEach(topic => {
                        const displayTitle = topic.displayTitle || topic.title;
                        resultsHTML += `<li><a href="${topic.link}">${displayTitle}</a>`;
                        if (topic.category) {
                            resultsHTML += `<span class="search-result-category">(${topic.category})</span>`;
                        }
                        resultsHTML += `</li>`;
                    });
                    resultsHTML += '</ul>';
                    
                    searchResultsContent.innerHTML = resultsHTML;
                    searchResults.style.display = 'block';
                    categoriesSection.classList.add('dimmed');
                } else {
                    searchResultsContent.innerHTML = '<p>No topics found matching your search.</p>';
                    searchResults.style.display = 'block';
                    categoriesSection.classList.add('dimmed');
                }
            });
            
            // Clear search when clicking outside
            document.addEventListener('click', function(e) {
                if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                    searchInput.value = '';
                    searchResults.style.display = 'none';
                    categoriesSection.classList.remove('dimmed');
                }
            });
            
            // Load attributions for person entries - use relative path for local development
            const attributionsPath = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:' 
                ? '../gleanings/attributions.json' 
                : '/gleanings/attributions.json';
            fetch(attributionsPath)
                .then(response => response.json())
                .then(attributions => {
                    // Simply extract the text from each attribution
                    const sortedAttributions = attributions.map(attr => attr.text);
                    
                    // Create list HTML
                    const listHTML = sortedAttributions.length > 0 
                        ? '<ul style="max-height: 300px; overflow-y: auto; font-size: 0.9em;">' + 
                          sortedAttributions.map(text => `<li>${text}</li>`).join('') + 
                          '</ul>'
                        : '<p>No attributions found.</p>';
                    
                    // Add modal HTML to the page
                    const modalHTML = `
                        <div id="attribution-modal" style="display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.4);">
                            <div style="background-color: #fefefe; margin: 10% auto; padding: 20px; border: 1px solid #888; width: 90%; max-width: 600px; position: relative;">
                                <span id="modal-close" style="color: #aaa; float: right; font-size: 28px; font-weight: bold; cursor: pointer;">&times;</span>
                                <h4 style="margin-top: 0; font-size: 1.2em;">Attributions</h4>
                                <p style="font-size: 0.9em;">Writings come from one of the following sources:</p>
                                ${listHTML}
                            </div>
                        </div>
                    `;
                    document.body.insertAdjacentHTML('beforeend', modalHTML);
                    
                    // Add click handlers AFTER modal is inserted
                    const asterisk = document.getElementById('attribution-asterisk');
                    const modal = document.getElementById('attribution-modal');
                    const closeBtn = document.getElementById('modal-close');
                    
                    if (asterisk && modal) {
                        asterisk.onclick = function() {
                            modal.style.display = 'block';
                        }
                        
                        if (closeBtn) {
                            closeBtn.onclick = function() {
                                modal.style.display = 'none';
                            }
                        }
                        
                        window.onclick = function(event) {
                            if (event.target == modal) {
                                modal.style.display = 'none';
                            }
                        }
                    }
                })
                .catch(error => {
                    console.error('Failed to load attributions:', error);
                });
        })
        .catch(error => {
            console.error('Error loading topics:', error);
            container.innerHTML = '<p>Error loading topics. Please try again later.</p>';
        });
});