import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateCardDto } from './dto/update-card.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { positionBetween } from '@/lib/position';
import { MoveCardDto } from './dto/move-card.dto';
import { EventsGateway } from '@/events/events.gateway';

@Injectable()
export class CardsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventsGateway,
  ) {}

  findOne(id: string) {
    return this.getOrThrow(id);
  }

  async create(dto: CreateCardDto) {
    const boardId = await this.boardIdOf(dto.columnId);
    const last = await this.prisma.card.findFirst({
      where: { columnId: dto.columnId },
      orderBy: { position: 'desc' },
    });
    const card = await this.prisma.card.create({
      data: {
        ...dto,
        position: positionBetween(last?.position ?? null, null),
      },
    });
    this.events.emitToBoard(boardId, 'card:created', card);
    return card;
  }

  async remove(id: string) {
    await this.getOrThrow(id);
    const card = await this.prisma.card.delete({
      where: { id },
    });

    const boardId = await this.boardIdOf(card.columnId);
    this.events.emitToBoard(boardId, 'card:deleted', card);
    return card;
  }

  async update(id: string, dto: UpdateCardDto) {
    await this.getOrThrow(id);
    const { column, ...card } = await this.prisma.card.update({
      where: { id },
      data: dto,
      include: { column: { select: { boardId: true } } },
    });
    this.events.emitToBoard(column.boardId, 'card:updated', card);
    return card;
  }

  async move(id: string, dto: MoveCardDto) {
    await this.getOrThrow(id);

    let prev: string | null = null;

    if (dto.afterCardId) {
      const after = await this.prisma.card.findUnique({
        where: { id: dto.afterCardId },
      });
      if (!after) {
        throw new BadRequestException(
          `Card ${dto.afterCardId} (afterCardId) not found`,
        );
      }
      if (after.columnId !== dto.columnId) {
        throw new BadRequestException(
          `Card ${dto.afterCardId} is not in column ${dto.columnId}`,
        );
      }
      prev = after.position;
    }

    const next = await this.prisma.card.findFirst({
      where: {
        columnId: dto.columnId,
        id: { not: id },
        ...(prev !== null && { position: { gt: prev } }),
      },
      orderBy: { position: 'asc' },
    });

    const position = positionBetween(prev, next?.position ?? null);

    const { column, ...card } = await this.prisma.card.update({
      where: { id },
      data: {
        columnId: dto.columnId,
        position,
      },
      include: { column: { select: { boardId: true } } },
    });
    this.events.emitToBoard(column.boardId, 'card:moved', card);
    return card;
  }

  private async getOrThrow(id: string) {
    const card = await this.prisma.card.findUnique({ where: { id } });
    if (!card) {
      throw new NotFoundException(`Card with id ${id} not found`);
    }
    return card;
  }

  private async boardIdOf(columnId: string): Promise<string> {
    const column = await this.prisma.column.findUnique({
      where: { id: columnId },
      select: { boardId: true },
    });
    if (!column)
      throw new BadRequestException(`Column with id ${columnId} not found`);
    return column.boardId;
  }
}
