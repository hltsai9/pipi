/* Practice log — records how many times each quiz has been practiced,
 * along with the date and time of every session. Maintained by the
 * "quiz-practice-log" skill. Keyed by "<collection>/<topic-key>".
 *
 * Schema:
 *   window.__practiceLog = {
 *     "kubernetes/cluster-architecture": {
 *       count: 2,
 *       sessions: [
 *         { date: "2026-06-27", time: "11:00" },
 *         { date: "2026-06-28", time: "09:30" }
 *       ]
 *     }
 *   };
 *
 * `count` always equals sessions.length. Times use 24-hour "HH:MM".
 */
window.__practiceLog = {
  "kubernetes/cluster-architecture": {
    count: 1,
    sessions: [
      { date: "2026-06-27", time: "11:00" }
    ]
  },
  "kubernetes/pods": {
    count: 1,
    sessions: [
      { date: "2026-06-28", time: "09:48" }
    ]
  },
  "kubernetes/deployments": {
    count: 1,
    sessions: [
      { date: "2026-06-28", time: "17:48" }
    ]
  }
};
