import { AddCommentModel } from '../models/comment.model';
import { faker } from '@faker-js/faker/locale/en';

export default function createRandomComment(
  bodySentences?: number,
): AddCommentModel {
  const body = faker.lorem.sentence(bodySentences);
  const newComment: AddCommentModel = { body: body };
  return newComment;
}
