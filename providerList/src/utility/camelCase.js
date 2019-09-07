export default function camelCase(field) {
  if (field.length > 0) {
    return field.replace('_', ' ').replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  return field;
}
