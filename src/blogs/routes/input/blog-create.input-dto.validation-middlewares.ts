import { nameValidation,descriptionValidation, websiteUrlValidation  } from "../validate/main";

export const createBlogValidationMiddleware = [
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
]