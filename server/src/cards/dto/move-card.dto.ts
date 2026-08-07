import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MoveCardDto {
  @IsString()
  @IsNotEmpty()
  columnId!: string;

  @IsOptional()
  @IsString()
  afterCardId?: string;
}
