/**
 * Auth Config class
 */
export class AuthConfig {
    samlActive?: boolean;
    samlAppId?: string;
    samlSubDomain?: string;
    samlTokenUrl?: string;
    samlAssertionUrl?: string;
    samlSecret?: string;
    samlClient?: string;
    ldapActive?: boolean;
}
