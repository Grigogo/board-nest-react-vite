import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@Injectable()
export class ColumnsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateColumnDto) {
    return this.prisma.column.create({ data: dto });
  }

  async update(id: string, dto: UpdateColumnDto) {
    await this.ensureExists(id);
    return this.prisma.column.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    return this.prisma.column.delete({ where: { id } });
  }

  private async ensureExists(id: string) {
    const column = await this.prisma.column.findUnique({ where: { id } });
    if (!column) {
      throw new NotFoundException(`Column with id ${id} not found`);
    }
  }
}
