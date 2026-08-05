import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateColumnDto } from './create-column.dto';

export class UpdateColumnDto extends PartialType(
  PickType(CreateColumnDto, ['title'] as const),
) {}
