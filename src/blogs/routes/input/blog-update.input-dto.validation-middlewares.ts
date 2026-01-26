import { nameValidation,descriptionValidation, websiteUrlValidation  } from "../validate/main";

export const updateBlogValidationMiddleware = [
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
]