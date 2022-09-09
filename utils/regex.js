const linkRegex = /(^http|https)?:\/\/(^w{3}\.)?\S{1,}\.([a-z]{3})\/?(\S{1,})?/;

const emailRegex = /^(?![.])(?!.*[.]{2})[^@]{1,}[^.]@[a-zA-Z]{1,}\.[a-z]{3}/;

/** emailRegex explanation:
 *  first part: Absolutely no `.` at the beginning, cannot repeat `.` consecutively,
 * ** `.` can't be at end, anything other than an `@`.
 *  second part: has to have `@`
 *  third part: anything a-zA-Z
 *  fourth part: has to have `.` followed by 3 letters */

module.exports = {
  linkRegex,
  emailRegex,
};
