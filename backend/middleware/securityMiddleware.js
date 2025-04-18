module.exports = (req, res, next) => {
    // Prevent Clickjacking Attacks
    res.setHeader("X-Frame-Options", "DENY");
  
    // Prevent XSS Attacks
    res.setHeader("X-XSS-Protection", "1; mode=block");
  
    // Prevent MIME-Type Sniffing
    res.setHeader("X-Content-Type-Options", "nosniff");
  
    next();
  };
  