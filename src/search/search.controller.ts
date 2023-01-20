import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';

@UseGuards(JwtAuthGuard)
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get(':param')
  findAll(@Param('param') param: string) {
    return this.searchService.findAll(param);
  }

  @Get(':collection/:param')
  findByCollection(
    @Param('collection') collection: string,
    @Param('param') param: string,
  ) {
    return this.searchService.findByCollection(collection, param);
  }
}
