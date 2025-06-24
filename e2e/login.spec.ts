import { expect, test } from '@playwright/test'
import { getTestUserCredentials } from './helpers/get-test-user-credentials.js'
import { LoginPage } from './page-objects/login-page.js'

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
    await expect(loginPage.getErrorMessage('Email is a required field')).toBeVisible()
    await expect(loginPage.getErrorMessage('Password is a required field')).toBeVisible()
  })

  test('validates invalid email format', async () => {
    await loginPage.login('invalid-email', 'password123')
    await expect(loginPage.getErrorMessage('Email must be a valid email')).toBeVisible()
  })

  test('logs in and redirects to /projects', async ({ page }) => {
    const { email, password } = getTestUserCredentials()
    await loginPage.login(email, password)
    await expect(page).toHaveURL('/projects', { timeout: 5000 })
  })

  test('shows error on failed login', async () => {
    await loginPage.login('wrong@example.com', 'wrong-password')
    await expect(loginPage.getInvalidCredentialsError()).toBeVisible()
  })
})
