import { faker } from '@faker-js/faker'
import { expect, test } from '@playwright/test'
import { RegisterPage } from './page-objects/register-page.js'

test.describe('Register Page', () => {
  let registerPage: RegisterPage

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page)
    await registerPage.goto()
  })

  test('renders registration form fields and button', async () => {
    await expect(registerPage.firstNameInput).toBeVisible()
    await expect(registerPage.lastNameInput).toBeVisible()
    await expect(registerPage.emailInput).toBeVisible()
    await expect(registerPage.passwordInput).toBeVisible()
    await expect(registerPage.acceptTermsCheckbox).toBeVisible()
    await expect(registerPage.registerButton).toBeVisible()
  })

  test('registers a new user and redirects to /login', async ({ page }) => {
    await registerPage.register(
      faker.person.firstName(),
      faker.person.lastName(),
      faker.internet.email(),
      faker.internet.password(),
    )
    await expect(page).toHaveURL('/login')
  })

  test('should show required field validation messages', async () => {
    await registerPage.registerButton.click()
    await expect(registerPage.getErrorMessage('First Name is a required field')).toBeVisible()
    await expect(registerPage.getErrorMessage('Last Name is a required field')).toBeVisible()
    await expect(registerPage.getErrorMessage('Email is a required field')).toBeVisible()
    await expect(registerPage.getErrorMessage('Password is a required field')).toBeVisible()
    await expect(
      registerPage.getErrorMessage('Please accept the Terms and Conditions'),
    ).toBeVisible()
  })

  test('should show email format validation message', async () => {
    await registerPage.emailInput.fill('invalid-email')
    await registerPage.registerButton.click()
    await expect(registerPage.getErrorMessage('Email must be a valid email')).toBeVisible()
  })
})
