import { Locator, Page } from '@playwright/test'

export abstract class BasePage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  getErrorMessage(message: string): Locator {
    return this.page.locator('.p-message-text', { hasText: message })
  }
}
