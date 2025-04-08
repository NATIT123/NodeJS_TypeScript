export const ErrNameMustBeAtLeast2Characters = new Error('Name must be at least 2 characters');
export const ErrPriceMustBePositive = new Error('Price must be positive');
export const ErrSalePriceMustBeNonnegative = new Error('Sale price must be nonnegative');
export const ErrQuantityMustBeNonnegative = new Error('Quantity must be nonnegative');
export const ErrBrandIdMustBeValidUUID = new Error('Brand ID must be a valid UUID');
export const ErrCategoryIdMustBeValidUUID = new Error('Category ID must be a valid UUID');

export const ErrFromPriceMustBePositive = new Error('From price must be positive');
export const ErrToPriceMustBePositive = new Error('To price must be positive');
export const ErrBrandNotFound = new Error('Brand not found');
export const ErrCategoryNotFound = new Error('Category not found');
