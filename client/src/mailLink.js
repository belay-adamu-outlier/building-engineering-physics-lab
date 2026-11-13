/** mailto URL used when the site is hosted without the API. */
export function mailLink(email, form) {
  const details = [
    'Name: ' + form.name,
    'Email: ' + form.email,
    '',
    form.message,
  ].join('\n');
  return 'mailto:' + email
    + '?subject=' + encodeURIComponent('Lab message')
    + '&body=' + encodeURIComponent(details);
}
