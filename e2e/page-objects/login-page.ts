import { Locator, Page } from '@playwright/test'
import { BasePage } from './base-page.js'

export class LoginPage extends BasePage {
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly loginButton: Locator

  constructor(page: Page) {
    super(page)
    this.emailInput = page.getByTestId('email-input')
    this.passwordInput = page.getByTestId('password-input')
    this.loginButton = page.getByTestId('login-button')
  }

  async goto() {
    await this.page.goto('/login')
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.loginButton.click()
  }

  getInvalidCredentialsError(): Locator {
    return this.getErrorMessage('Authentication with the provided credentials failed.')
  }
}
