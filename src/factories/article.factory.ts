import { AddArticleModel } from '../models/article.model';
import { faker } from '@faker-js/faker/locale/en';

export default function randomNewArticle(
  titleLength?: number,
  bodyLength?: number,
): AddArticleModel {
  const title = faker.string.alpha(titleLength);

  const body = faker.string.alpha(bodyLength);

  const newArticle: AddArticleModel = { title: title, body: body };
  return newArticle;
}
