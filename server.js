const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/search', async (req, res) => {
    const { email } = req.body;
    
    try {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        
        await page.goto('https://niggerbase.xyz');
        
        await page.click('span:contains("Email")');
        await page.type('#query', email);
        await page.click('button[type="submit"]');
        
        await page.waitForSelector('#results', { timeout: 30000 });
        
        await page.waitForTimeout(5000);
        
        const content = await page.evaluate(() => document.body.innerText);
        const contentLines = content.split('\n');
        const trimmedContent = contentLines.slice(10).join('\n');
        
        await browser.close();
        
        res.json({ result: trimmedContent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
