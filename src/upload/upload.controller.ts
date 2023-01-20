import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { v4 as uuidv4 } from 'uuid';

import {
  Controller,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseGuards,
  BadRequestException,
  Response,
  Get,
} from '@nestjs/common';
import * as fs from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':collection/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: async (req, file, cb) => {
          const { collection } = req.params;
          const folderToAccess = ['doctor', 'hospital', 'user'];

          if (folderToAccess.includes(collection))
            return cb(null, `./public/uploads/${collection}`);

          return cb(new BadRequestException('Collection not found.'), 'Error');
        },
        filename: (req, file, cb) => {
          const extension = file.mimetype.split('/').at(-1);
          const fileName = `${uuidv4()}.${extension}`;

          cb(null, fileName);
        },
      }),
    }),
  )
  uploadImage(
    @Param('collection') collection: string,
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1048576 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.uploadService.uploadImage(collection, id, file);
  }

  @Get(':collection/:id')
  getImage(
    @Param('collection') collection: string,
    @Param('id') id: string,
    @Response() response,
  ) {
    if (fs.existsSync(`./public/uploads/${collection}/${id}`)) {
      return response.sendFile(`uploads/${collection}/${id}`, {
        root: './public',
      });
    } else {
      return response.sendFile('uploads/no-image.jpg', {
        root: './public',
      });
    }
  }
}
