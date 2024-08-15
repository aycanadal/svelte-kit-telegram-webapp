import { expect, test } from '@playwright/test';

test('home page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('h1')).toBeVisible();
});

test('profile redirects to login', async ({ page }) => {

	await page.goto('/profile');
	await expect(
		page.locator('h1')
			.filter({ hasText: "Log In" })
	).toBeVisible();

});

test('can sign up and log in and view profile', async ({ page }) => {

	await page.goto('/signup');
	await page.locator('p')
		.filter({ hasText: "Please copy and save this token" })
		.isHidden()

	const telegramId = "4358", password = "p"

	await page.getByLabel("Telegram Id:").fill(telegramId);
	await page.getByLabel("Password:").fill(password);
	const button = page.getByRole('button', { name: /Sign up/i })
	await button.click();

	await expect(
		page.locator('p')
			.filter({ hasText: "Please copy and save this token somewhere safe:" })
	).toBeVisible()

	const token = await page.locator('#token').textContent()

	await page.goto('/login');

	await page.getByLabel("Telegram Id:").fill(telegramId);
	await page.getByLabel("Password:").fill(password);
	const loginButton = page.getByRole('button', { name: /Log in/i })
	await loginButton.click();

	await expect(
		page.locator('p')
			.filter({ hasText: "Please enter token:" })
	).toBeVisible()

	await page.getByLabel("Token:").fill(token!);
	const submitTokenButton = page.getByRole('button', { name: /Submit token/i })
	await submitTokenButton.click();

	await expect(
		page.getByLabel("Token:")
	).toBeHidden()

	await page.goto('/profile');
	await expect(
		page.locator('p')
			.filter({ hasText: telegramId })
	).toBeVisible()

});