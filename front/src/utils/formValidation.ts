export const getFieldValidationClass = (
  isTouched: boolean,
  hasError: boolean,
  isDirty: boolean
): string => {
  if (!isTouched) return "";

  if (hasError) return "border-red-500 focus:border-red-500";
  if (isDirty && !hasError) return "border-green-500 focus:border-green-500";

  return "";
};
