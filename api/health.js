// Health check endpoint
module.exports = (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'QuickResume AI API is running on Vercel' 
  });
};
