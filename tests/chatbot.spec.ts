import { test, expect } from '@playwright/test';

test('Chatbot flow for Q&A', async ({ page }) => {
    test.setTimeout(300000);
    await page.goto('http://localhost:3001');
    const chatInput = page.locator('textarea[placeholder="Ask away!"]');
    await chatInput.fill('Wie is de product owner van Diego?');
    // send button
    await page.click('button:has-text("Send")');
    // wait for response
    await expect(page.locator('p')).toContainText('Mehmet Yenel', { timeout: 240000 });
});


test('Contact button opens NDW contact page in new tab', async ({ page, context }) => {
    await page.goto('http://localhost:3001');
    const [contactPage] = await Promise.all([
        context.waitForEvent('page'),
        page.click('a[href="https://www.ndw.nu/contact"]')
    ]);
    await contactPage.waitForLoadState();
    expect(contactPage.url()).toContain('ndw.nu/contact');
});

test('NDW website button opens NDW home page in new tab', async ({ page, context }) => {
    await page.goto('http://localhost:3001');
    const [homePage] = await Promise.all([
        context.waitForEvent('page'),
        page.click('a[href="https://www.ndw.nu"]')
    ]);
    await homePage.waitForLoadState();
    expect(homePage.url()).toBe('https://www.ndw.nu/');
});