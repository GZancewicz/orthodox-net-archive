// Category definitions for organizing Gleanings topics
const TOPIC_CATEGORIES = {
    "Prayer & Worship": [
        "Prayer", "Morning Prayer", "Evening Prayer", "Jesus Prayer", "Unceasing Prayer",
        "Contemplation", "Meditation", "Spiritual Reading", 
        "Divine Liturgy", "Holy Communion", "Services", "Worship", "Liturgy", "Eucharist",
        "Communion", "Body and Blood", "Transubstantiation",
        "Bridegroom Services", "Holy Monday", "Holy Tuesday", "Holy Wednesday",
        "Holy Thursday", "Holy Friday", "Holy Saturday",
        "Candles", "Icons", "Veneration", "Reverence", "Sacred",
        "Compunction", "Contrition", "Tears", "Mourning"
    ],
    
    "Virtues": [
        "Love", "Humility", "Patience", "Kindness", "Compassion", "Mercy",
        "Faith", "Hope", "Charity", "Almsgiving", "Alsmgiving", "Generosity",
        "Chastity", "Purity", "Temperance", "Moderation", "Self-Control",
        "Courage", "Perseverance", "Endurance", "Enduring Wrongs", "Long-Suffering",
        "Honesty", "Truthfulness", "Integrity", "Sincerity", "Simplicity",
        "Obedience", "Submission", "Meekness", "Gentleness", "Mildness",
        "Forgiveness", "Forgiving Others", "Forgiveness of Others", "Forgivness",
        "Gratitude", "Thankfulness", "Joy", "Peace", "Contentment",
        "Wisdom", "Understanding", "Knowledge", "Discernment", "Discretion",
        "Detachment", "Dispassion", "Freedom", "Liberty", "Independence",
        "Beatitudes", "Beauty", "Goodness", "Good", "Virtue", "Virtues",
        "Bodily Virtues", "Continence", "Abstinence", "Sobriety"
    ],
    
    "Sins & Passions": [
        "Pride", "Vainglory", "Arrogance", "Boasting", "Boastfulness", "Conceit",
        "Anger", "Wrath", "Rage", "Hatred", "Resentment", "Bitterness",
        "Envy", "Jealousy", "Covetousness", "Avarice", "Greed", "Aquisitiveness",
        "Lust", "Fornication", "Adultery", "Impurity", "Unchastity",
        "Gluttony", "Drunkenness", "Intemperance", "Excess", "Indulgence",
        "Sloth", "Acedia", "Despondency", "Depression", "Despair", "Laziness",
        "Judgment", "Criticism", "Condemnation", "Gossip", "Slander", "Calumny",
        "Lying", "Deceit", "Deception", "Falsehood", "Dishonesty",
        "Blasphemy", "Blasphemy Against the Holy Spirit", "Sacrilege", "Profanity",
        "Bad Thoughts", "Evil Thoughts", "Bad Habits", "Evil Habits", "Sin", "Sins",
        "Temptation", "Temptations", "Demonic Temptations", "Demonic Deceptions",
        "Passions", "Attachment", "Addiction", "Obsession", "Compulsion",
        "Deliberate Sin", "Corrupt Life", "Evil", "Vice", "Vices",
        "Cruelty", "Contempt", "Dishonor", "Dishonour", "Cowardice",
        "Curiosity", "Double Mindedness", "Doubts", "Fantasy"
    ],
    
    "Spiritual Struggle": [
        "Spiritual Struggle", "Spiritual Warfare", "Spiritual Growth", "Spiritual Progress",
        "Spiritual Life", "Ascesis", "Asceticism", "Fasting", "Vigils", "Prostrations",
        "Watchfulness", "Attention", "Nepsis", "Sobriety", "Vigilance",
        "Silence", "Stillness", "Hesychasm", "Quietness", "Solitude",
        "Repentance", "Confession", "Penance", "Absolution", "Reconciliation",
        "Asking Forgiveness", "Asking in Prayer", "Bearing the Cross", "Cross",
        "Demons", "Devil", "Satan", "Evil Spirits", "Fallen Angels",
        "Demonic Deceptions", "Demonic Temptations", "Exorcism",
        "Effort", "Struggle", "Combat", "Battle", "Warfare",
        "Dryness", "Desolation", "Abandonment", "Testing", "Trials",
        "Change", "Conversion", "Transformation", "Renewal", "Reform"
    ],
    
    "Daily Christian Life": [
        "Marriage", "Family", "Children", "Parenting", "Motherhood", "Fatherhood",
        "Christian Home", "Domestic Life", "Household", "Home Life", "Christian Life",
        "Work", "Labor", "Vocation", "Career", "Employment", "Business",
        "Money", "Wealth", "Poverty", "Possessions", "Property", "Stewardship",
        "Suffering", "Affliction", "Afflictions", "Trials", "Tribulations", "Hardship",
        "Illness", "Sickness", "Disease", "Healing", "Medicine", "Health",
        "Death", "Dying", "Mortality", "Funeral", "Burial", "Memorial", "Death of Saints",
        "Grief", "Mourning", "Sorrow", "Bereavement", "Loss", "Consolation",
        "Relationships", "Friendship", "Love of Neighbor", "Community", "Fellowship",
        "Education", "Learning", "Study", "Teaching", "Instruction", "Knowledge",
        "Speech", "Words", "Conversation", "Communication", "Language",
        "Thoughts", "Mind", "Intellect", "Reason", "Logic", "Philosophy",
        "Emotions", "Feelings", "Heart", "Affections", "Sentiments",
        "Body", "Flesh", "Physical", "Material", "Corporeal", "Bodily Cares",
        "Bodily Pleasures", "Bodily Suffering", "Food", "Eating", "Clothing",
        "Entertainment", "Anxiety", "Fear", "Worry", "Stress"
    ],
    
    "Theology & Doctrine": [
        "God", "Trinity", "Father", "Son", "Holy Spirit", "Incarnation",
        "Theotokos", "Virgin Mary", "Mother of God", "Panagia",
        "Creation", "Fall", "Ancestral Sin", "Original Sin", "Redemption",
        "Salvation", "Justification", "Sanctification", "Deification", "Theosis",
        "Angels", "Archangels", "Guardian Angels", "Cherubim", "Seraphim",
        "Church", "Tradition", "Scripture", "Bible", "Gospel", "Apostles",
        "Dogma", "Doctrine", "Teaching", "Theology", "Orthodoxy", "Catholic",
        "Sacraments", "Mysteries", "Baptism", "Chrismation", "Confirmation",
        "Baptism Canons", "Canons Baptism", "Canons", "Councils",
        "Unction", "Holy Oil", "Ordination", "Priesthood", "Ministry",
        "Bishop", "Bishops", "Priest", "Priests", "Deacon", "Clergy",
        "Resurrection", "Eternal Life", "Afterlife", "Heaven", "Hell",
        "Last Judgment", "Second Coming", "End Times", "Apocalypse",
        "Antichrist", "False Prophet", "Mark of the Beast", "Tribulation",
        "Atonement", "Crucifixion", "Sacrifice", "Redemption",
        "Free Will", "Foreknowledge", "Providence", "Predestination"
    ],
    
    "Feasts & Saints": [
        "Nativity", "Christmas", "Birth of Christ",
        "Theophany", "Epiphany", "Baptism of Christ", "Jordan",
        "Annunciation", "Conception", "Gabriel", "Salutation",
        "Great Lent", "Lent", "Fasting Season", "Preparation",
        "Holy Week", "Passion Week", "Great and Holy Week",
        "Pascha", "Easter", "Resurrection", "Bright Week", "Bright Friday",
        "Ascension", "Assumption", "Taking Up", "Forty Days",
        "Pentecost", "Descent of the Holy Spirit", "Trinity Sunday",
        "Transfiguration", "Tabor", "Light", "Glory",
        "Dormition", "Falling Asleep", "Assumption of Mary",
        "Exaltation of the Cross", "Golgotha",
        "Entrance of the Theotokos", "Presentation", "Temple",
        "Church Feasts", "Feast Days", "Celebrations", "Commemorations",
        "Saints", "Martyrs", "Confessors", "Hierarchs", "Monastics",
        "Commemoration of Saints", "Relics", "Miracles",
        "Saint", "Holy", "Holiness", "Sanctity", "Glorification"
    ],
    
    "Monasticism": [
        "Monasticism", "Monastic Life", "Monastic", "Monastery", "Convent",
        "Desert Fathers", "Desert Mothers", "Abbas", "Ammas", "Elders",
        "Hermit", "Anchorite", "Recluse", "Solitary", "Eremitic",
        "Cenobitic Life", "Community Life", "Common Life", "Brotherhood",
        "Abbot", "Abbess", "Hegumen", "Igumen", "Superior",
        "Cell", "Skete", "Lavra", "Hermitage", "Desert",
        "Monastic Stories", "Sayings", "Apophthegmata", "Patericon",
        "Obedience", "Poverty", "Chastity", "Vows", "Tonsure",
        "Schema", "Great Schema", "Habit", "Cowl", "Mantle",
        "Rule", "Typicon", "Ustav", "Order", "Discipline"
    ]
};

// Function to categorize a topic
function categorizeTopic(topicTitle) {
    // Check each category
    for (const [categoryName, keywords] of Object.entries(TOPIC_CATEGORIES)) {
        // Check if topic matches any keyword in this category
        for (const keyword of keywords) {
            if (topicTitle.toLowerCase() === keyword.toLowerCase()) {
                return categoryName;
            }
        }
    }
    
    // Additional pattern matching for topics not exactly matching keywords
    const lowerTitle = topicTitle.toLowerCase();
    
    // Prayer patterns
    if (lowerTitle.includes('prayer') || lowerTitle.includes('pray') || 
        lowerTitle.includes('liturgy') || lowerTitle.includes('worship')) {
        return "Prayer & Worship";
    }
    
    // Virtues patterns
    if (lowerTitle.includes('virtue') || lowerTitle.includes('good') || 
        lowerTitle.includes('holy') || lowerTitle.includes('righteous') ||
        lowerTitle.includes('love') || lowerTitle.includes('humble')) {
        return "Virtues";
    }
    
    // Sins patterns
    if (lowerTitle.includes('sin') || lowerTitle.includes('evil') || 
        lowerTitle.includes('passion') || lowerTitle.includes('vice') ||
        lowerTitle.includes('temptation') || lowerTitle.includes('demon')) {
        return "Sins & Passions";
    }
    
    // Spiritual struggle patterns
    if (lowerTitle.includes('spiritual') || lowerTitle.includes('struggle') || 
        lowerTitle.includes('fast') || lowerTitle.includes('ascet')) {
        return "Spiritual Struggle";
    }
    
    // Theology patterns
    if (lowerTitle.includes('god') || lowerTitle.includes('christ') || 
        lowerTitle.includes('spirit') || lowerTitle.includes('doctrine') ||
        lowerTitle.includes('dogma') || lowerTitle.includes('theology') ||
        lowerTitle.includes('church')) {
        return "Theology & Doctrine";
    }
    
    // Feasts patterns
    if (lowerTitle.includes('feast') || lowerTitle.includes('nativity') || 
        lowerTitle.includes('pascha') || lowerTitle.includes('easter') ||
        lowerTitle.includes('saint') || lowerTitle.includes('martyr')) {
        return "Feasts & Saints";
    }
    
    // Monastic patterns
    if (lowerTitle.includes('monast') || lowerTitle.includes('monk') || 
        lowerTitle.includes('desert') || lowerTitle.includes('hermit') ||
        lowerTitle.includes('abbot')) {
        return "Monasticism";
    }
    
    // Life patterns
    if (lowerTitle.includes('life') || lowerTitle.includes('living') || 
        lowerTitle.includes('daily') || lowerTitle.includes('family') ||
        lowerTitle.includes('marriage') || lowerTitle.includes('death')) {
        return "Daily Christian Life";
    }
    
    // Default to Other
    return "Other Topics";
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TOPIC_CATEGORIES, categorizeTopic };
}