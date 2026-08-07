import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { positionBetween } from '@/lib/position';
import { EventsGateway } from '@/events/events.gateway';

@Injectable()
export class ColumnsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventsGateway,
  ) {}

  async create(dto: CreateColumnDto) {
    const last = await this.prisma.column.findFirst({
      where: { boardId: dto.boardId },
      orderBy: { position: 'desc' },
    });
    const column = await this.prisma.column.create({
      data: {
        ...dto,
        position: positionBetween(last?.position ?? null, null),
      },
    });
    this.events.emitToBoard(column.boardId, 'column:created', column);
    return column;
  }

  async update(id: string, dto: UpdateColumnDto) {
    await this.getOrThrow(id);
    const column = await this.prisma.column.update({
      where: { id },
      data: dto,
    });
    this.events.emitToBoard(column.boardId, 'column:updated', column);
    return column;
  }

  async remove(id: string) {
    await this.getOrThrow(id);
    const column = await this.prisma.column.delete({ where: { id } });
    this.events.emitToBoard(column.boardId, 'column:deleted', column);
    return column;
  }

  private async getOrThrow(id: string) {
    const column = await this.prisma.column.findUnique({ where: { id } });
    if (!column) {
      throw new NotFoundException(`Column with id ${id} not found`);
    }
    return column;
  }
}
