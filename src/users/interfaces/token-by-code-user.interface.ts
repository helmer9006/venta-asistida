export interface TokenByCode {
    user:    User;
    idToken: string;
}

export interface User {
    homeAccountId:  string;
    environment:    string;
    tenantId:       string;
    username:       string;
    localAccountId: string;
    idTokenClaims:  IDTokenClaims;
}

export interface IDTokenClaims {
    ver:         string;
    iss:         string;
    sub:         string;
    aud:         string;
    exp:         number;
    iat:         number;
    auth_time:   number;
    given_name:  string;
    family_name: string;
    emails:      string[];
    tfp:         string;
    nbf:         number;
}
