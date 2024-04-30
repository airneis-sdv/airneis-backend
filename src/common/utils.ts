import * as crypto from "crypto";

export class Utils {
  static generateRandomString(byteCount: number) {
    return crypto.randomBytes(byteCount).toString("hex");
  }

  static slugify(text: string) {
    return text.replace(/\W/g, "-");
  }
}
