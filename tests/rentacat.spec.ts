import { test, expect } from '@playwright/test';

var baseURL = 'http://localhost:8080';

test.beforeEach(async ({ page }) => {
    await page.goto(baseURL);
    await page.evaluate(() => {
        document.cookie = '1=false';
        document.cookie = '2=false';
        document.cookie = '3=false';
    })
})

test('TEST-1-RESET', async ({ page }) => {
    await page.evaluate(() => {
        document.cookie = '1=true';
        document.cookie = '2=true';
        document.cookie = '3=true';
    })

    await page.getByRole('link', {name: 'Reset'}).click();

    const cats = page.getByRole('list', {name: 'Cat names', exact: true}).getByRole('listitem');
    await expect(cats.nth(0)).toHaveText('ID 1. Jennyanydots');
    await expect(cats.nth(1)).toHaveText('ID 2. Old Deuteronomy');
    await expect(cats.nth(2)).toHaveText('ID 3. Mistoffelees');
})

test('TEST-2-CATALOG', async ({ page }) => {
    await page.getByRole('link', {name: 'Catalog'}).click();

    const catsPic = page.getByRole('list', { name: 'Cat photos' , exact: true}).getByRole('listitem')
    await expect(catsPic.nth(1).getByRole('img')).toHaveAttribute('src', '/images/cat2.jpg');
})

test('TEST-3-LISTING', async ({ page }) => {
    await page.getByRole('link', {name: 'Catalog', exact: true}).click();

    const cats = page.getByRole('list', {name: 'Cat names', exact: true}).getByRole('listitem');
    await expect(cats).toHaveCount(3);
    await expect(cats.nth(2)).toHaveText('ID 3. Mistoffelees');
})

test('TEST-4-RENT-A-CAT', async ({ page }) => {
    await page.getByRole('link', {name: 'Rent-A-Cat'}).click();

    const rentButton = page.getByRole('button', { name: 'Rent', exact: true });
    const returnButton = page.getByRole('button', { name: 'Return', exact: true });
    await expect(rentButton).toBeVisible();
    await expect(returnButton).toBeVisible();
})

test('TEST-5-RENT', async ({ page }) => {
    await page.getByRole('link', {name: 'Rent-A-Cat', exact: true}).click();
    await page.getByLabel('Enter the ID of the cat to rent:').fill('1');
    await page.getByRole('button', {name: 'Rent', exact: true}).click();
    
    const cats = page.getByRole('list', {name: 'Cat names', exact: true}).getByRole('listitem');
    await expect(cats.nth(0)).toHaveText('Rented out');
    await expect(cats.nth(1)).toHaveText('ID 2. Old Deuteronomy');
    await expect(cats.nth(2)).toHaveText('ID 3. Mistoffelees');
    await expect(page.getByText('Success!')).toBeVisible();
})

test('TEST-6-RETURN', async ({ page }) => {
    await page.evaluate(() => {
        document.cookie = '2=true';
        document.cookie = '3=true';
    })

    await page.getByRole('link', {name: 'Rent-A-Cat', exact: true}).click();
    await page.getByLabel('Enter the ID of the cat to return:').fill('2');
    await page.getByRole('button', {name: 'Return', exact: true}).click();

    const cats = page.getByRole('list', {name: 'Cat names', exact: true}).getByRole('listitem');
    await expect(cats.nth(0)).toHaveText('ID 1. Jennyanydots');
    await expect(cats.nth(1)).toHaveText('ID 2. Old Deuteronomy');
    await expect(cats.nth(2)).toHaveText('Rented out');
    await expect(page.getByText('Success!')).toBeVisible();
})

test('TEST-7-FEED-A-CAT', async ({ page }) => {
    await page.getByRole('link', {name: 'Feed-A-Cat', exact: true}).click();

    const feedButton = page.getByRole('button', { name: 'Feed', exact: true });
    await expect(feedButton).toBeVisible();
})

test('TEST-8-FEED', async ({ page }) => {
    await page.getByRole('link', {name: 'Feed-A-Cat', exact: true}).click();
    await page.getByLabel('Number of catnips to feed:').fill('6');
    await page.getByRole('button', {name: 'Feed', exact: true}).click();

    await expect(page.getByText('Nom, nom, nom.')).toBeVisible({timeout: 10000});
})

test('TEST-9-GREET-A-CAT', async ({ page }) => {
    await page.getByRole('link', {name: 'Greet-A-Cat', exact: true}).click();
    
    await expect(page.getByText('Meow!Meow!Meow!')).toBeVisible();
})

test('TEST-10-GREET-A-CAT-WITH-NAME', async ({ page }) => {
    await page.goto(baseURL + '/greet-a-cat/Jennyanydots');

    await expect(page.getByText('Meow! from Jennyanydots.')).toBeVisible();
})

test('TEST-11-FEED-A-CAT-SCREENSHOT', async ({ page }) => {
    await page.evaluate(() => {
        document.cookie = '1=true';
        document.cookie = '2=true';
        document.cookie = '3=true';
    })

    await page.getByRole('link', {name: 'Feed-A-Cat', exact: true}).click();

    await expect(page.locator('body')).toHaveScreenshot();
})
