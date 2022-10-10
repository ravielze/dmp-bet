import { ValidationError } from "../error";
import {
  ValidationError as rawValidationError,
  validate as rawValidate,
} from "class-validator";

export const BaseValidatorConstructor = function (source: any, dest: any) {
  const allowedKeys: string[] = Object.keys(dest);
  Object.assign(dest, source);
  Object.keys(dest)
    .filter((key) => allowedKeys.indexOf(key) === -1)
    .forEach((key) => {
      const findAndRemoveKey = (key: string) => {
        type keyType = keyof typeof dest;
        for (const k in dest) {
          const keyCasted: keyType = k;
          if (k === key) {
            delete dest[keyCasted];
            return;
          }
        }
      };

      findAndRemoveKey(key);
    });
};

export async function validate(item: any) {
  const errs: rawValidationError[] = await rawValidate(item);
  if (!errs || errs.length == 0) {
    return;
  }
  throw new ValidationError(errs);
}
