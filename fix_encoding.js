const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    'c:/Users/isomiddin/Desktop/UstaTop/home.html',
    'c:/Users/isomiddin/Desktop/UstaTop/registratsiya.html',
    'c:/Users/isomiddin/Desktop/UstaTop/account.html',
    'c:/Users/isomiddin/Desktop/UstaTop/login.html'
];

const ustalarDir = 'c:/Users/isomiddin/Desktop/UstaTop/ustalar';
const hududlarDir = 'c:/Users/isomiddin/Desktop/UstaTop/hududlar';

// Add all subpages
fs.readdirSync(ustalarDir).forEach(f => filesToUpdate.push(path.join(ustalarDir, f)));
fs.readdirSync(hududlarDir).forEach(f => filesToUpdate.push(path.join(hududlarDir, f)));

filesToUpdate.forEach(filePath => {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace various mangled versions of Farg'ona
    const before = content;
    content = content.replace(/FargÊ»ona/g, "Farg'ona");
    content = content.replace(/Fargʻona/g, "Farg'ona");
    content = content.replace(/Farg’ona/g, "Farg'ona");
    
    if (before !== content) {
        console.log(`Fixed encoding in ${filePath}`);
        fs.writeFileSync(filePath, content);
    }
});
