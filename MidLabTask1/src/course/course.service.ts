
import { Injectable } from '@nestjs/common';

@Injectable()
export class CourseService {
  getAllCourses() {
    return 'Get All Courses - from Service';
  }

  getCourseById(id: string) {
    return `Get Course with ID: ${id} - from Service`;
  }

  createCourse() {
    return 'Create Course - from Service';
  }

  updateCourse(id: string) {
    return `Update Course ${id} - from Service`;
  }

  patchCourse(id: string) {
    return `Patch Course ${id} - from Service`;
  }

  deleteCourse(id: string) {
    return `Delete Course ${id} - from Service`;
  }
}
