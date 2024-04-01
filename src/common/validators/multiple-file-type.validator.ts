import { FileValidator } from "@nestjs/common";
import * as fileType from "file-type-mime";

export interface CustomUploadTypeValidatorOptions {
  fileType: string[];
}

export class MultipleFileTypeValidator extends FileValidator {
  private _allowedMimeTypes: string[];

  constructor(protected readonly validationOptions: CustomUploadTypeValidatorOptions) {
    super(validationOptions);
    this._allowedMimeTypes = this.validationOptions.fileType;
  }

  public isValid(file?: Express.Multer.File): boolean {
    return this._allowedMimeTypes.includes(file?.mimetype || fileType.parse(file?.buffer)?.mime);
  }

  public buildErrorMessage(): string {
    return `Upload not allowed. Upload only files of type: ${this._allowedMimeTypes.join(
      ", ",
    )}`;
  }
}
