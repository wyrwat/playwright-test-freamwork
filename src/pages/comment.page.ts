import { MainMenuComponent } from '../components/main-menu.component';
import { BasePage } from './base.page';
import { Locator, Page } from '@playwright/test';

export class CommentPage extends BasePage {
  url = '/comment.html';
  mainMenu: MainMenuComponent;
  commentBody: Locator;
  editButton: Locator;
  alerPopup: Locator;
  returnToArticleButton: Locator;

  constructor(page: Page) {
    super(page);
    this.mainMenu = new MainMenuComponent(page);
    this.commentBody = this.page.getByTestId('comment-body');
    this.editButton = this.page.getByTestId('edit');
    this.alerPopup = this.page.getByTestId('alert-popup');
    this.returnToArticleButton = this.page.getByTestId('return');
  }
}
