import { Course, Semester, GradingScale, GradePointMap } from "@/types";

export const GRADE_POINTS_5: GradePointMap = {
  "A": 5,
  "B": 4,
  "C": 3,
  "D": 2,
  "E": 1,
  "F": 0,
};

export const GRADE_POINTS_4: GradePointMap = {
  "A": 4,
  "B": 3,
  "C": 2,
  "D": 1,
  "E": 0, // In some 4.0 scales E is F, but we'll include it for safety
  "F": 0,
};

export function getGradePoint(grade: string, scale: GradingScale): number {
  const map = scale === "5.0" ? GRADE_POINTS_5 : GRADE_POINTS_4;
  return map[grade.toUpperCase()] ?? 0;
}

export function calculateGPA(courses: Course[], scale: GradingScale): { gpa: number; totalUnits: number } {
  let totalUnits = 0;
  let totalQualityPoints = 0;

  courses.forEach((course) => {
    // Only calculate if a grade is selected
    if (course.grade && course.units > 0) {
      const gp = getGradePoint(course.grade, scale);
      totalQualityPoints += gp * course.units;
      totalUnits += course.units;
    }
  });

  const gpa = totalUnits > 0 ? totalQualityPoints / totalUnits : 0;
  return { gpa: parseFloat(gpa.toFixed(2)), totalUnits };
}

export function calculateCGPA(semesters: Semester[], scale: GradingScale): { cgpa: number; totalUnits: number } {
  let totalUnits = 0;
  let totalQualityPoints = 0;

  semesters.forEach((semester) => {
    semester.courses.forEach((course) => {
      if (course.grade && course.units > 0) {
        const gp = getGradePoint(course.grade, scale);
        totalQualityPoints += gp * course.units;
        totalUnits += course.units;
      }
    });
  });

  const cgpa = totalUnits > 0 ? totalQualityPoints / totalUnits : 0;
  return { cgpa: parseFloat(cgpa.toFixed(2)), totalUnits };
}

export function calculateTargetGPA(
  currentCGPA: number,
  completedUnits: number,
  targetCGPA: number,
  remainingUnits: number
): number {
  if (remainingUnits <= 0) return 0;

  const totalUnits = completedUnits + remainingUnits;
  const totalQPRequired = targetCGPA * totalUnits;
  const currentQP = currentCGPA * completedUnits;
  const remainingQPRequired = totalQPRequired - currentQP;

  const requiredGPA = remainingQPRequired / remainingUnits;
  return parseFloat(requiredGPA.toFixed(2));
}

// Map score to Grade (standard Nigerian university grading system for 5.0, can be customized)
export function scoreToGrade(score: number, scale: GradingScale): string {
  if (scale === "5.0") {
    if (score >= 70) return "A";
    if (score >= 60) return "B";
    if (score >= 50) return "C";
    if (score >= 45) return "D";
    if (score >= 40) return "E";
    return "F";
  } else {
    if (score >= 70) return "A";
    if (score >= 60) return "B";
    if (score >= 50) return "C";
    if (score >= 45) return "D";
    return "F";
  }
}
