import { StatusCodes } from "./http";

export function StringPadding(
  width: number,
  string: string,
  padding: string
): string {
  return width <= string.length
    ? string
    : StringPadding(width, string + padding, padding);
}

export function MethodFormat(method: string) {
  method = method.toLowerCase();
  switch (method) {
    case "get":
      return `🟩 ${StringPadding(7, "GET", " ")}`;
    case "post":
      return `🟦 ${StringPadding(7, "POST", " ")}`;
    case "patch":
      return `🟨 ${StringPadding(7, "PATCH", " ")}`;
    case "put":
      return `🟧 ${StringPadding(7, "PUT", " ")}`;
    case "delete":
      return `🟥 ${StringPadding(7, "DELETE", " ")}`;
  }
  return `❔ ${StringPadding(7, "UNKNOWN", " ")}`;
}

export function HttpStatusFormat(status: StatusCodes) {
  if (status < 200) {
    return `🟦 ${status} ${StatusCodes[status]}`;
  } else if (status < 300) {
    return `🟩 ${status} ${StatusCodes[status]}`;
  } else if (status < 400) {
    return `🟨 ${status} ${StatusCodes[status]}`;
  } else if (status < 500) {
    return `🟥 ${status} ${StatusCodes[status]}`;
  } else {
    return `🟧 ${status} ${StatusCodes[status]}`;
  }
}
