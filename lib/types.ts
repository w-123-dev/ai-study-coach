export interface StudentProfile {
  id: string;
  user_id: string;
  exam_year: number;
  school: string;
  major: string;
  subjects: string[];
  level: string;
  daily_hours: number;
  weak_subjects: string[];
  study_plan: StudyPlan | null;
  created_at: string;
  updated_at: string;
}

export interface StudyPlanStage {
  name: string;
  period: string;
  weeks: number;
  goal: string;
  focus: string;
}

export interface WeeklyTask {
  subject: string;
  content: string;
  hours: number;
}

export interface WeeklyPlan {
  week: number;
  period: string;
  tasks: WeeklyTask[];
}

export interface DailyRoutine {
  weekday: string;
  weekend: string;
  tips: string[];
}

export interface StudyPlan {
  stages: StudyPlanStage[];
  weekly_plan: WeeklyPlan[];
  daily_routine: DailyRoutine;
}
