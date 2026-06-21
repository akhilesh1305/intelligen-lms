export {
  isDemoMode,
  shouldUseDemoData,
  isDemoExperienceActive,
  DEMO_ADMIN_EMAIL,
  DEMO_LEARNER_EMAIL,
  DEMO_ACCOUNT_PASSWORD,
  DEMO_ACCOUNTS,
} from "./config";
export {
  DEMO_ORGANIZATION,
  DEMO_LEARNER_NAME,
  DEMO_ADMIN_NAME,
  DEMO_LEARNER_TITLE,
  DEMO_ADMIN_TITLE,
} from "./brand";
export { DEMO_LEARNERS, getDemoLearnerAvatarUrl } from "./learners";
export {
  DEMO_COURSES,
  DEMO_CERTIFICATE_TYPES,
  getDemoCoursesForCatalog,
  getDemoReviewStats,
  getDemoStudentEnrollments,
  getDemoRecommendations,
  getDemoUserBadges,
  getDemoInstructorCourses,
  getDemoInstructorAnalytics,
} from "./courses";
export {
  getDemoCertificateHubData,
  getDemoCertificateList,
  getDemoCertificateCount,
} from "./certificates";
export {
  getDemoWeeklyLeaderboard,
  getDemoLeaderboardAnalytics,
  getDemoCorporateLeaderboard,
  getDemoCorporateBadgeRank,
} from "./leaderboard";
export {
  getDemoGamesPlayerProfile,
  getDemoGamesHubStats,
} from "./games";
export { getDemoLearningHistory } from "./learning-history";
export type { DemoLearningHistoryEntry } from "./learning-history";
export {
  getDemoPlatformAnalytics,
  getDemoPendingCourses,
  getDemoPendingInstructorCount,
  getDemoLearnerStatsSummary,
} from "./analytics";
