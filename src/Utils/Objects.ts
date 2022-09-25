import TextEdit from "../components/TextEdit.svelte";

export function validateFields(object: any) {
  if (!object) {
    return false;
  }
  for (const item of Object.entries(object)) {
    if (
      (typeof item?.[1] !== 'object' && typeof item?.[1] !== 'boolean') ||
      (typeof item?.[1] === 'object' && !validateFields(item?.[1])) ||
      !item?.[1]
    ) {
      return false;
    }
  }
  return true;
}

export function updateInputs(inputs: any, object: any) {
  for (const key of Object.keys(inputs)) {
    if (typeof object[key] === 'object' && typeof inputs === 'object' && key in inputs) {
      updateInputs(inputs?.[key], object[key]);
    } else if (['bigint', 'boolean', 'number', 'string', 'symbol', 'undefined'].includes(typeof object[key]) && typeof inputs === 'object' && key in inputs && inputs?.[key] instanceof TextEdit) {
      inputs?.[key]?.updateValue(object[key]);
    }
  }
  return true;
}
