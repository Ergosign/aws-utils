
export interface AllowedHosts {
  [index:string] : string[]
}


export class ValidateCorsHost {

  

  static validateHostName = (allowedHosts:AllowedHosts, originHostname: string): boolean => {
    const websiteRootDomain = process.env.WEBSITE_ROOT_DOMAIN ?? 'no-root-domain';
    const corsAllowLocalhost = process.env.CORS_ALLOW_LOCALHOST === 'true' ?? false;
    const runningStage = process.env.WEBSITE_ENVIRONMENT_STAGE ?? 'no-stage-set';
    // is the hostname part of the expected root domain?
    if (originHostname.endsWith(websiteRootDomain)){
      return true;
    }

    // is the hostname localhost and is that allowed?
    if (originHostname.startsWith("http://localhost") && corsAllowLocalhost){
      return true;
    }

    // check allowedHosts for the environment
    if (allowedHosts[runningStage] && allowedHosts[runningStage].find( allowedHost => allowedHost === originHostname) !== undefined){
      return true;
    }

    return false;
  }

  static generateAllowOriginForOrigin = (allowedHosts:AllowedHosts, inputOrigin:string) => {
    const websiteRootDomain = process.env.WEBSITE_ROOT_DOMAIN || 'no-root-domain';
    const runningStage = process.env.WEBSITE_ENVIRONMENT_STAGE ?? 'no-stage-set';
    const defaultOrigin = `https://www.${websiteRootDomain}`;

    var allowedOrigin : string;
    // Check if request is from one of the allowed servers
    if (ValidateCorsHost.validateHostName(allowedHosts,inputOrigin)){
      allowedOrigin = inputOrigin;
    }else{
      allowedOrigin = defaultOrigin;
    }
    return allowedOrigin;
  }

}


