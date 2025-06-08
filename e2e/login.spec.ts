import { test, expect } from '@playwright/test'
import { LoginPage } from './page-objects/LoginPage.js'

const email = process.env.TEST_USER_EMAIL!
const password = process.env.TEST_USER_PASSWORD!

test.describe('Login Page', () => {
  let loginPage: LoginPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    await loginPage.goto()
  })

  test('renders login form fields and button', async () => {
    await expect(loginPage.emailInput).toBeVisible()
    await expect(loginPage.passwordInput).toBeVisible()
    await expect(loginPage.loginButton).toBeVisible()
  })

  test('shows errors for empty form submission', async () => {
    await loginPage.login('', '')
    await expect(await loginPage.getErrorMessage('Email is a required field')).toBeVisible()
    await expect(await loginPage.getErrorMessage('Password is a required field')).toBeVisible()
  })

  test('validates invalid email format', async () => {
    await loginPage.login('invalid-email', 'password123')
    await expect(await loginPage.getErrorMessage('Email must be a valid email')).toBeVisible()
  })

  test('logs in and redirects to /projects', async ({ page }) => {
    await loginPage.login(email, password)
    await page.waitForURL('/projects', { timeout: 5000 })
    await expect(page).toHaveURL('/projects')
  })

  test('shows error on failed login', async () => {
    await loginPage.login('wrong@example.com', 'wrongpassword')
    await expect(
      await loginPage.getErrorMessage('Authentication with the provided credentials failed.'),
    ).toBeVisible()
  })
})
