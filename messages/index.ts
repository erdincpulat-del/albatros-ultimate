import { tr } from "./tr";
import { en } from "./en";

export type Lang = "tr" | "en";

export const messages = {
  tr,
  en,
};

export function getMessages(lang: Lang) {
  return messages[lang];
}