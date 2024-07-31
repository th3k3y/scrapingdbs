app.post('/search', async (req, res) => {
    const { email } = req.body;
    
    try {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        
        await page.goto('https://niggerbase.xyz');
        
        // Vérifiez si la page s'est chargée correctement
        if (page.url() !== 'https://niggerbase.xyz') {
            throw new Error("La page n'a pas pu être chargée correctement");
        }
        
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
        console.error('Erreur lors du scraping:', error);
        res.status(500).json({ error: "Une erreur s'est produite lors de la recherche. Veuillez réessayer." });
    }
});
