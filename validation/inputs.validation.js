class Validator {
  static isRequired(value) {
    return value.trim() !== '';
  }
  static isEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook|hotmail|icloud)\.com$/;
    return emailRegex.test(email);
  }
  static isPhoneNumber(phone) {
    const phoneRegex = /^\+?[0-9]{8,15}$/;
    return phoneRegex.test(phone);
  }
  static isPassword(password) {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    return passwordRegex.test(password);
  }
  static isConfPassword(confpassword, password) {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    return passwordRegex.test(confpassword);
  }
  static isOtpCode(code) {
    return /^[0-9]{6}$/.test(code);
  }
  static isRating(rating) {
    return rating >= 1 && rating <= 5;
  }
  static isPostalCode(code) {
    // return /^[0-9]{4,10}$/.test(code);
    return code.trim() !== '';
  }
  static isImage(file) {
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const extension = file.split('.').pop().toLowerCase();
    return validExtensions.includes(extension);
  }
  static isInArray(value, array) {
    return array.includes(value);
  }
  static hasMinLength(value, minLength) {
    return value.length >= minLength;
  }
  static hasLength(value, Length) {
    return value.length === Length;
  }
}

// ................................

//   User Validation Class

// ................................
class UserValidator extends Validator {
  constructor(user) {
    super();
    this.user = user;
  }

  validateName() {
    return Validator.isRequired(this.user.name) && Validator.hasMinLength(this.user.name, 3);
  }

  validateEmail() {
    return Validator.isEmail(this.user.email);
  }

  validatePhoneNumber() {
    return Validator.isPhoneNumber(this.user.phone);
  }

  validateMessage() {
    return Validator.hasMinLength(this.user.message, 10);
  }

  validatePassword() {
    return Validator.isPassword(this.user.password);
  }

  validateConfPassword() {
    if (this.user.confpassword !== this.user.password) {
      return false;
    } else {
      return Validator.isPassword(this.user.confpassword, this.user.password);
    }
  }

  validateImage() {
    return Validator.isImage(this.user.image);
  }

  validateOtpCode() {
    return Validator.isOtpCode(this.user.verificationCode);
  }

  validateReview() {
    return Validator.isRating(this.user.review);
  }

  validateReviewDescription() {
    return Validator.hasMinLength(this.user.reviewDescription, 20);
  }

  validateAddress() {
    return (
      Validator.isRequired(this.user.street) &&
      Validator.isRequired(this.user.building) &&
      Validator.isRequired(this.user.state) &&
      Validator.isRequired(this.user.city) &&
      Validator.isPostalCode(this.user.postalCode)
    );
  }

  validateCountryCode() {
    const validCountryCodes = [
      "AF", "AL", "DZ", "AS", "AD", "AO", "AG", "AR", "AM", "AW",
      "AU", "AT", "AZ", "BS", "BH", "BD", "BB", "BY", "BE", "BZ",
      "BJ", "BM", "BT", "BO", "BA", "BW", "BR", "BG", "BF", "BI",
      "KH", "CM", "CA", "CV", "KY", "CF", "TD", "CL", "CN", "CO",
      "KM", "CG", "CD", "CK", "CR", "CI", "HR", "CU", "CY", "CZ",
      "DK", "DJ", "DM", "DO", "EC", "EG", "ER", "EE", "ET", "FK",
      "FO", "FJ", "FI", "FR", "GA", "GM", "GE", "DE", "GH", "GI",
      "GR", "GL", "GD", "GT", "GN", "GW", "GY", "HT", "HN", "HU",
      "ID", "IR", "IQ", "IE", "IL", "IT", "JM", "JP", "JO", "KZ",
      "KE", "KI", "KP", "KR", "KW", "KG", "LA", "LV", "LB", "LS",
      "LR", "LY", "LI", "LT", "LU", "MG", "MW", "MY", "MV", "ML",
      "MT", "MH", "MQ", "MR", "MU", "MX", "FM", "MD", "MC", "MN",
      "ME", "MS", "MA", "MZ", "MM", "NA", "NR", "NP", "NL", "NZ",
      "NI", "NE", "NG", "NU", "NF", "MP", "NO", "OM", "PK", "PW",
      "PS", "PA", "PG", "PY", "PE", "PH", "PL", "PT", "PR", "QA",
      "RO", "RU", "RW", "RE", "BL", "SH", "KN", "LC", "PM", "VC",
      "WS", "SM", "ST", "SA", "SN", "RS", "SC", "SL", "SG", "SK",
      "SI", "SB", "SO", "ZA", "SS", "ES", "LK", "SD", "SR", "SZ",
      "SE", "CH", "SY", "TW", "TJ", "TZ", "TH", "TL", "TG", "TK",
      "TO", "TT", "TN", "TR", "TM", "TV", "UG", "UA", "AE", "GB",
      "US", "UY", "UZ", "VU", "VE", "VN", "VI", "WF", "YE", "ZM",
      "ZW"
    ];
    // const validCountryCodes = ['US', 'CA', 'GB', 'FR', 'DE'];
    return Validator.isInArray(this.user.countryCode, validCountryCodes);
  }

  validateComment() {
    return (
      Validator.hasLength(this.user.blogId, 24) &&
      Validator.isRequired(this.user.comment)
    )
  }
  validateId() {
    return (
      Validator.hasLength(this.user.Id, 24)
    )
  }
  validateArray() {
    return (
      Validator.isInArray(this.user.Item, ['Pending', 'Approved', 'Rejected'])
    )
  }
  validateLike() {
    return (
      // Validator.hasLength(this.user.userId, 24) &&
      Validator.isRequired(this.user.slug) &&
      Validator.isInArray(Boolean(this.user.status), [true, false])
    )
  }

  validateAll() {
    return (
      this.validateName() &&
      this.validateEmail() &&
      this.validatePhoneNumber() &&
      this.validateMessage() &&
      this.validatePassword() &&
      this.validateOtpCode() &&
      this.validateReview() &&
      this.validateReviewDescription() &&
      this.validateAddress() &&
      this.validateCountryCode() &&
      this.validateComment()
    );
  }
}


// ................................

//   Admin Validation Class

// ................................
class AdminValidator extends Validator {
  constructor(admin) {
    super();
    this.admin = admin;
  }

  validateProduct() {
    console.log("Validate feature: ", Validator.isInArray(Boolean(this.admin.featured), [true, false]));
    // console.log("Validate color: ", Validator.isInArray(this.admin.colors, ['red', 'blue', 'green', 'white', 'black', 'yellow']));
    return (
      Validator.isRequired(this.admin.name) &&
      Validator.isRequired(this.admin.description) &&
      !isNaN(this.admin.price) &&
      // Validator.isImage(this.admin.images) &&
      !isNaN(this.admin.stockQuantity) &&
      Validator.isInArray(Boolean(this.admin.featured), [true, false]) &&
      // Validator.isInArray(this.admin.colors, ['red', 'blue', 'green', 'white', 'black', 'yellow']) &&
      Validator.isRequired(this.admin.colors) &&
      Validator.isRequired(this.admin.categoryId) &&
      Validator.hasLength(this.admin.categoryId, 24) &&
      !isNaN(this.admin.weight) &&
      !isNaN(this.admin.length) &&
      !isNaN(this.admin.width) &&
      !isNaN(this.admin.height)
    );
  }

  validateUserStatus() {
    return Validator.isInArray(this.admin.Status, ['Active', 'Inactive']);
  }

  validateBlogPost() {
    console.log("Validate Title: ", Validator.isRequired(this.admin.blogTitle));
    console.log("Validate Slug: ", Validator.isRequired(this.admin.blogSlug))
    console.log("Validate MDescription: ", Validator.isRequired(this.admin.blogMetaDescription))
    console.log("Validate Content: ", Validator.isRequired(this.admin.blogContent))
    console.log("Validate Category: ", Validator.hasLength(this.admin.blogCategory, 24))
    console.log("Validate BlogStatus: ", Validator.isInArray(this.admin.blogStatus, ['draft', 'published', 'unpublish']))
    return (
      Validator.isRequired(this.admin.blogTitle) &&
      Validator.isRequired(this.admin.blogSlug) &&
      Validator.isRequired(this.admin.blogMetaDescription) &&
      Validator.isRequired(this.admin.blogContent) &&
      Validator.hasLength(this.admin.blogCategory, 24) &&
      Validator.isInArray(this.admin.blogStatus, ['draft', 'published', 'unpublish'])
    );
  }
  validateSlug() {
    return (
      Validator.isRequired(this.admin.blogSlug)
    );
  }
  validateId() {
    return (
      Validator.hasLength(this.admin.blogId, 24)
    );
  }

  validateRoleAssignment() {
    const validRoles = ['Admin', 'User', 'Moderator'];
    return Validator.isInArray(this.admin.assignRole, validRoles);
  }

  validatePermissions() {
    const validPermissions = [
      'Manage Products', 'Manage Orders', 'Manage Users', 'Manage Blogs'
    ];
    return this.admin.userPermissions.every(permission => Validator.isInArray(permission, validPermissions));
  }

  validateSiteSettings() {
    return (
      Validator.isRequired(this.admin.siteTitle) &&
      Validator.isRequired(this.admin.siteDescription) &&
      Validator.isImage(this.admin.siteLogo) &&
      Validator.isRequired(this.admin.siteMetaTags)
    );
  }

  validateEmailTemplates() {
    return (
      Validator.isRequired(this.admin.orderConfirmationEmail) &&
      Validator.isRequired(this.admin.shippingUpdateEmail)
    );
  }

  validateAll() {
    return (
      this.validateProduct() &&
      this.validateUserStatus() &&
      this.validateBlogPost() &&
      this.validateRoleAssignment() &&
      this.validatePermissions() &&
      this.validateSiteSettings() &&
      this.validateEmailTemplates()
    );
  }
}


export {
  UserValidator,
  AdminValidator
}