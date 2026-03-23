const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    'c:/Users/isomiddin/Desktop/UstaTop/home.html',
    'c:/Users/isomiddin/Desktop/UstaTop/registratsiya.html',
    'c:/Users/isomiddin/Desktop/UstaTop/account.html',
    'c:/Users/isomiddin/Desktop/UstaTop/login.html',
    'c:/Users/isomiddin/Desktop/UstaTop/chat system.html'
];

const ustalarDir = 'c:/Users/isomiddin/Desktop/UstaTop/ustalar';
const hududlarDir = 'c:/Users/isomiddin/Desktop/UstaTop/hududlar';

fs.readdirSync(ustalarDir).forEach(f => filesToUpdate.push(path.join(ustalarDir, f)));
fs.readdirSync(hududlarDir).forEach(f => filesToUpdate.push(path.join(hududlarDir, f)));

filesToUpdate.forEach(filePath => {
    if (!fs.existsSync(filePath)) return;
    if (!filePath.endsWith('.html')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    const before = content;

    // Fix Socket.io to use CDN for better compatibility
    content = content.replace(/http:\/\/localhost:5000\/socket\.io\/socket\.io\.js/g, "https://cdn.socket.io/4.7.2/socket.io.min.js");
    
    // Ensure all Farg'ona spelling is clean
    content = content.replace(/FargÊ»ona/g, "Farg'ona");
    content = content.replace(/Fargʻona/g, "Farg'ona");
    content = content.replace(/Farg’ona/g, "Farg'ona");
    
    // Fix API URLs in subpages if they were hardcoded
    content = content.replace(/http:\/\/localhost:5000\/api/g, "http://localhost:5000/api"); // keep for now but could be relative

    if (before !== content) {
        console.log(`Updated ${filePath}`);
        fs.writeFileSync(filePath, content);
    }
});
