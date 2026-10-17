import {Controller,Get,Post,Put,Patch,Delete,Param,Body,UseInterceptors,UploadedFile,BadRequestException,} 
from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import type { Express } from 'express';
import { extname } from 'path';

import { CourseService } from './course.service.js';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  getAllCourses() {
    return this.courseService.getAllCourses();
  }

  @Get(':id')
  getCourseById(@Param('id') id: string) {
    return this.courseService.getCourseById(id);
  }

  @Post()
  createCourse(@Body() dto: CreateCourseDto) {
    return this.courseService.createCourse(dto);
  }

  @Put(':id')
  updateCourse(
    @Param('id') id: string,
    @Body() dto: UpdateCourseDto,
  ) {
    return this.courseService.updateCourse(id, dto);
  }

  @Patch(':id')
  patchCourse(
    @Param('id') id: string,
    @Body() dto: UpdateCourseDto,
  ) {
    return this.courseService.patchCourse(id, dto);
  }

  @Delete(':id')
  deleteCourse(@Param('id') id: string) {
    return this.courseService.deleteCourse(id);
  }

  @Post(':id/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, callback) => {
          const uniqueName =
            `${Date.now()}-${Math.round(Math.random() * 1e9)}` +
            extname(file.originalname);
          callback(null, uniqueName);
        },
      }),
      fileFilter: (_req, file, callback) => {
        const allowedExtensions = /\.(jpg|jpeg|png|pdf)$/i;

        if (!allowedExtensions.test(extname(file.originalname))) {
          return callback(
            new BadRequestException(
              'Only JPG, JPEG, PNG, and PDF files are allowed',
            ),
            false,
          );
        }

        callback(null, true);
      },
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
    }),
  )
  uploadCourseMaterial(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('A valid file is required');
    }

    return this.courseService.uploadCourseMaterial(id, file);
  }
}