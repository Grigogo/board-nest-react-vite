import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCardDto } from './dto/update-card.dto';
import { CreateCardDto } from './dto/create-card.dto';

@Injectable()
export class CardsService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string) {
    const card = await this.prisma.card.findUnique({
      where: { id },
    });
    if (!card) throw new NotFoundException(`Card with id ${id} not found`);
    return card;
  }

  create(dto: CreateCardDto) {
    return this.prisma.card.create({
      data: dto,
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    return this.prisma.card.delete({
      where: { id },
    });
  }

  async update(id: string, dto: UpdateCardDto) {
    await this.ensureExists(id);
    return this.prisma.card.update({
      where: { id },
      data: dto,
    });
  }

  private async ensureExists(id: string) {
    const card = await this.prisma.card.findUnique({ where: { id } });
    if (!card) {
      throw new NotFoundException(`Card with id ${id} not found`);
    }
  }
}
