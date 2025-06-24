import { Locator, Page } from '@playwright/test'
import { BasePage } from './base-page.js'

export class RegisterPage extends BasePage {
  readonly firstNameInput: Locator
  readonly lastNameInput: Locator
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly acceptTermsCheckbox: Locator
  readonly registerButton: Locator

  constructor(page: Page) {
    super(page)
    this.firstNameInput = page.getByTestId('first-name-input')
    this.lastNameInput = page.getByTestId('last-name-input')
    this.emailInput = page.getByTestId('email-input')
    this.passwordInput = page.getByTestId('password-input')
    this.acceptTermsCheckbox = page.getByTestId('accept-terms-checkbox')
    this.registerButton = page.getByTestId('register-button')
  }

  async goto() {
    await this.page.goto('/register')
  }

  async register(firstName: string, lastName: string, email: string, password: string) {
    await this.firstNameInput.fill(firstName)
    await this.lastNameInput.fill(lastName)
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.acceptTermsCheckbox.click()
    await this.registerButton.click()
  }
}
