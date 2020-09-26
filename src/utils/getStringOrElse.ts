export const getStringOrElse = (value: any, orElse: string = "") => {
  return typeof value === "string" ? value : orElse;
};
