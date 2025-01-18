import { Page } from '@playwright/test';

export class BasePage {
  url = '';
  constructor(protected page: Page) {}

  async goto(parameter = ''): Promise<void> {
    await this.page.goto(`${this.url}${parameter}`);
  }

  async getTitle(): Promise<string> {
    await this.page.waitForLoadState();
    return await this.page.title();
  }
  async waitForPageToLoadUrl(): Promise<void> {
    await this.page.waitForURL(`${this.url}*`);
  }
}
