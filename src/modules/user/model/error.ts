export const ErrFirstNameAtLeast2Chars = new Error(
  "First name must be at least 2 characters"
);
export const ErrLastNameAtLeast2Chars = new Error(
  "Last name must be at least 2 characters"
);
export const ErrEmailInvalid = new Error("Email is invalid");
export const ErrPasswordAtLeast6Chars = new Error(
  "Password must be at least 6 characters"
);
export const ErrBirthdayInvalid = new Error("Birthday is invalid");
export const ErrGenderInvalid = new Error("Gender is invalid");
export const ErrRoleInvalid = new Error("Role is invalid");
export const ErrEmailExisted = new Error("Email is already existed");
export const ErrInvalidEmailAndPassword = new Error(
  "Invalid email and password"
);
export const ErrUserInactivated = new Error("User is inactivated or banned");
export const ErrInvalidToken = new Error("Invalid token");
