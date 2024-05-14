export function hasProperty(obj: any, propertyName: string): boolean {
  if (typeof obj !== 'object' || Array.isArray(obj)) {
    return false;
  }
  return Object.keys(obj).includes(propertyName, 0);
}
