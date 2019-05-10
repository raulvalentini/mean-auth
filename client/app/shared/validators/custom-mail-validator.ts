/**
 * Custom Email Validator
 */
export class CustomMailValidator {
  static email(email): any {
    const emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if ( emailRe.test(email.value)) {
      return null;
    }
    return {
      email: true
    };
  }
}
