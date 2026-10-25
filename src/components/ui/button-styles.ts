/**
 * The primary (filled green) button colours. One definition so every primary button in the app, admin and learner,
 * stays legible in all ten themes: paper-on-pine-600 on light themes, chalkboard-on-pine-300 on dark themes
 * (the previous chalkboard-on-pine-500 was only 2.5-4.1:1 on dark themes). Checked by npm run verify:contrast.
 */
export const primaryButtonColors =
  "bg-pine-600 text-paper hover:bg-pine-700 dark:bg-pine-300 dark:text-chalkboard dark:hover:bg-pine-100";
