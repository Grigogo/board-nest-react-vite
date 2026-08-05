import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateCardDto } from './create-card.dto';

export class UpdateCardDto extends PartialType(
  PickType(CreateCardDto, ['title', 'description'] as const),
) {}
