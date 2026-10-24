
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { CourseService } from '../course/course.service.js';
import { NotificationService } from '../notification/notification.service.js';

@Injectable()
export class EnrollmentService {
  constructor(
  private readonly courseService: CourseService,
  @Inject(forwardRef(() => NotificationService))
  private readonly notificationService: any,
) {}

  getEnrollments() {
    return {
      message: 'All enrollments fetched',
      data: [],
    };
  }

  enrollStudent(studentName: string, courseId: string) {
    const course = this.courseService.getCourseById(courseId);

    const notification = this.notificationService.sendNotification(
      studentName,
      'Enrollment successful',
    );

    return {
      message: 'Student enrolled successfully',
      student: studentName,
      course,
      notification,
    };
  }
}
