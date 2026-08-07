import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @IsString()
  @IsNotEmpty()
  columnId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}
