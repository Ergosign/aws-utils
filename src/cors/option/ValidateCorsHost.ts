
export class ValidateCorsHost {

  static validateHostName = (originHostname: string): boolean => {
    const websiteRootDomain = process.env.WEBSITE_ROOT_DOMAIN || 'no-root-domain';
    const corsAllowLocalhostString = process.env.CORS_ALLOW_LOCALHOST || 'false';

    // is the hostname part of the expected root domain?
    if (originHostname.endsWith(websiteRootDomain)){
      return true;
    }

    // is the hostname localhost and is that allowed?
    const corsAllowLocalhost = corsAllowLocalhostString === 'true';
    if (originHostname.startsWith("http://localhost") && corsAllowLocalhost){
      return true;
    }

    return false;
  }

  static generateAllowOriginForOrigin = (inputOrigin:string) => {
    const websiteRootDomain = process.env.WEBSITE_ROOT_DOMAIN || 'no-root-domain';
    const defaultOrigin = `https://www.${websiteRootDomain}`;

    var allowedOrigin : string;
    // Check if request is from one of the allowed servers
    if (ValidateCorsHost.validateHostName(inputOrigin)){
      allowedOrigin = inputOrigin;
    }else{
      allowedOrigin = defaultOrigin;
    }
    return allowedOrigin;
  }

}


