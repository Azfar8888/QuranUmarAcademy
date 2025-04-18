const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

// Function to perform a MongoDB backup
const backupDatabase = () => {
  const backupPath = path.join(__dirname, "../backups");
  if (!fs.existsSync(backupPath)) {
    fs.mkdirSync(backupPath, { recursive: true });
  }

  const fileName = `backup_${new Date().toISOString().replace(/[:.]/g, "-")}.gz`;
  const command = `mongodump --uri=${process.env.MONGO_URI} --archive=${backupPath}/${fileName} --gzip`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Backup Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Backup stderr: ${stderr}`);
      return;
    }
    console.log(`Database backup completed: ${fileName}`);
  });
};

// Schedule backups every 24 hours
setInterval(backupDatabase, 24 * 60 * 60 * 1000); // 24 hours in milliseconds

module.exports = backupDatabase;
