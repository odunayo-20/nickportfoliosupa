const fs = require('fs');
const path = require('path');
const directory = 'c:/Users/user/Documents/Programming/Nextjs_Projects/nickportfoliosupabase/app/(main)';
function fixDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            fixDir(fullPath);
        } else if (fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('\\n')) {
                content = content.replace(/\\n/g, '\n');
                fs.writeFileSync(fullPath, content);
                console.log('Fixed', fullPath);
            }
        }
    }
}
fixDir(directory);
