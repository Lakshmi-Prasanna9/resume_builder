const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/js', express.static(path.join(__dirname, '../js')));

// AI Enhancement endpoint
app.post('/api/enhance', (req, res) => {
  const { text, type } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  // AI Enhancement logic (simulated)
  const enhancedText = enhanceText(text, type);
  
  res.json({ 
    original: text,
    enhanced: enhancedText,
    type: type
  });
});

// Text enhancement function
function enhanceText(text, type) {
  const actionVerbs = [
    'Developed', 'Implemented', 'Designed', 'Created', 'Built',
    'Managed', 'Led', 'Spearheaded', 'Optimized', 'Streamlined',
    'Engineered', 'Architected', 'Delivered', 'Achieved', 'Improved'
  ];

  const professionalPhrases = {
    'made': 'developed',
    'did': 'executed',
    'helped': 'assisted',
    'worked on': 'contributed to',
    'was responsible for': 'managed',
    'in charge of': 'oversaw',
    'fixed': 'resolved',
    'started': 'initiated',
    'changed': 'transformed',
    'got': 'obtained'
  };

  let enhanced = text;

  // Convert to professional language
  Object.keys(professionalPhrases).forEach(key => {
    const regex = new RegExp(`\\b${key}\\b`, 'gi');
    enhanced = enhanced.replace(regex, professionalPhrases[key]);
  });

  // Add action verbs at the beginning if it's a bullet point
  if (type === 'experience' || type === 'projects') {
    const sentences = enhanced.split(/[.!?]+/).filter(s => s.trim());
    const enhancedSentences = sentences.map((sentence, index) => {
      const trimmed = sentence.trim();
      if (trimmed && index < actionVerbs.length) {
        // Check if already starts with an action verb
        const startsWithVerb = actionVerbs.some(verb => 
          trimmed.toLowerCase().startsWith(verb.toLowerCase())
        );
        if (!startsWithVerb) {
          return `${actionVerbs[index % actionVerbs.length]} ${trimmed.charAt(0).toLowerCase() + trimmed.slice(1)}`;
        }
      }
      return trimmed;
    });
    enhanced = enhancedSentences.join('. ') + (enhanced.endsWith('.') ? '' : '.');
  }

  // Enhance summary
  if (type === 'summary') {
    enhanced = enhanced.replace(/i am/gi, 'A dedicated professional');
    enhanced = enhanced.replace(/i have/gi, 'possessing');
    enhanced = enhanced.replace(/i like/gi, 'passionate about');
    enhanced = enhanced.replace(/good at/gi, 'proficient in');
    enhanced = enhanced.replace(/worked with/gi, 'experienced with');
  }

  // Clean up
  enhanced = enhanced.replace(/\s+/g, ' ').trim();
  
  // Ensure proper punctuation
  if (!enhanced.endsWith('.') && !enhanced.endsWith('!') && !enhanced.endsWith('?')) {
    enhanced += '.';
  }

  return enhanced;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'QuickResume AI API is running' });
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 QuickResume AI Server running on http://localhost:${PORT}`);
});

module.exports = app;
