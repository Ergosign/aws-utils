import { AllowedHosts } from "./../ValidateCorsHost";
import { ValidateCorsHost } from "../ValidateCorsHost";

describe("Test if domain valid", () => {
  const OLD_ENV = process.env;
  const TEST_ROOT_DOMAIN = "test-root-domain.com";

  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  const emptyAllowedHosts = {};

  test("Test DEV allows localhost", () => {
    // Setup ENV variables for DEV
    process.env.WEBSITE_ROOT_DOMAIN = TEST_ROOT_DOMAIN;
    process.env.CORS_ALLOW_LOCALHOST = "true";

    expect(
      ValidateCorsHost.validateHostName(
        emptyAllowedHosts,
        "http://localhost:3000"
      )
    ).toBeTruthy();
  });

  test("validate empty Origin returns false", () => {
    process.env.WEBSITE_ROOT_DOMAIN = TEST_ROOT_DOMAIN;
    expect(
      ValidateCorsHost.validateHostName({},
        undefined!
      )
    ).toBeFalsy();
  });
  test("Test DEV allows any localhost port ", () => {
    // Setup ENV variables for DEV
    process.env.WEBSITE_ROOT_DOMAIN = TEST_ROOT_DOMAIN;
    process.env.CORS_ALLOW_LOCALHOST = "true";

    expect(
      ValidateCorsHost.validateHostName(
        emptyAllowedHosts,
        "http://localhost:8080"
      )
    ).toBeTruthy();
    expect(
      ValidateCorsHost.validateHostName(
        emptyAllowedHosts,
        "http://localhost:9999"
      )
    ).toBeTruthy();
    expect(
      ValidateCorsHost.validateHostName(
        emptyAllowedHosts,
        "http://localhost:4321"
      )
    ).toBeTruthy();
  });

  test("Test STAGING does not allow localhost", () => {
    // Setup ENV variables for STAGING
    process.env.WEBSITE_ROOT_DOMAIN = TEST_ROOT_DOMAIN;
    process.env.CORS_ALLOW_LOCALHOST = "false";

    expect(
      ValidateCorsHost.validateHostName(
        emptyAllowedHosts,
        "http://localhost:3000"
      )
    ).toBeFalsy();
  });

  test("Test www in configured root allowed", () => {
    // Setup ENV variables
    process.env.WEBSITE_ROOT_DOMAIN = TEST_ROOT_DOMAIN;
    expect(
      ValidateCorsHost.validateHostName(
        emptyAllowedHosts,
        `https://www.${TEST_ROOT_DOMAIN}`
      )
    ).toBeTruthy();
  });

  test("Test random other subdomain in configured root allowed", () => {
    // Setup ENV variables
    process.env.WEBSITE_ROOT_DOMAIN = TEST_ROOT_DOMAIN;
    expect(
      ValidateCorsHost.validateHostName(
        emptyAllowedHosts,
        `https://fox-trot.${TEST_ROOT_DOMAIN}`
      )
    ).toBeTruthy();
  });

  test("Test alternate domain not allowed", () => {
    // Setup ENV variables
    process.env.WEBSITE_ROOT_DOMAIN = TEST_ROOT_DOMAIN;
    expect(
      ValidateCorsHost.validateHostName(
        emptyAllowedHosts,
        `https://alternate-test-domain.de`
      )
    ).toBeFalsy();
  });

  test("Test alternate subdomain and domain not allowed", () => {
    // Setup ENV variables
    process.env.WEBSITE_ROOT_DOMAIN = TEST_ROOT_DOMAIN;
    expect(
      ValidateCorsHost.validateHostName(
        emptyAllowedHosts,
        `https://www.alternate-test-domain.de`
      )
    ).toBeFalsy();
  });

  test("Test allowedHosts contains", () => {
    // Setup ENV variables
    process.env.WEBSITE_ROOT_DOMAIN = TEST_ROOT_DOMAIN;
    process.env.WEBSITE_ENVIRONMENT_STAGE = 'stage';
    const allowedHosts = {
      'stage': ['https://allowed-host-approved.de']
    }
    expect(
      ValidateCorsHost.validateHostName(
        allowedHosts,
        `https://allowed-host-approved.de`
      )
    ).toBeTruthy();
  });

  test("Test allowedHosts doesn't contains", () => {
    // Setup ENV variables
    process.env.WEBSITE_ROOT_DOMAIN = TEST_ROOT_DOMAIN;
    process.env.WEBSITE_ENVIRONMENT_STAGE = 'stage';
    const allowedHosts = {
      'stage': ['https://allowed-host-approved.de']
    }
    expect(
      ValidateCorsHost.validateHostName(
        allowedHosts,
        `https://not-allowed-host-approved.de`
      )
    ).toBeFalsy();
  });

  test("Test allowedHosts doesn't contains for stage", () => {
    // Setup ENV variables
    process.env.WEBSITE_ROOT_DOMAIN = TEST_ROOT_DOMAIN;
    process.env.WEBSITE_ENVIRONMENT_STAGE = 'production';
    const allowedHosts = {
      'stage': ['https://allowed-host-approved.de']
    }
    expect(
      ValidateCorsHost.validateHostName(
        allowedHosts,
        `https://allowed-host-approved.de`
      )
    ).toBeFalsy();
  });
});

describe("Test allowed origin for domains", () => {
  const OLD_ENV = process.env;
  const TEST_ROOT_DOMAIN = "test-root-domain.com";
  const emptyAllowedHosts = {};

  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  test("DEV + localhost", () => {
    // Setup ENV variables for DEV
    process.env.WEBSITE_ROOT_DOMAIN = TEST_ROOT_DOMAIN;
    process.env.CORS_ALLOW_LOCALHOST = "true";

    expect(
      ValidateCorsHost.generateAllowOriginForOrigin(emptyAllowedHosts,"http://localhost:3000")
    ).toMatch("http://localhost:3000");
  });

  test("STAGING + localhost", () => {
    // Setup ENV variables for DEV
    process.env.WEBSITE_ROOT_DOMAIN = TEST_ROOT_DOMAIN;
    process.env.CORS_ALLOW_LOCALHOST = "false";

    expect(
      ValidateCorsHost.generateAllowOriginForOrigin(emptyAllowedHosts,"http://localhost:3000")
    ).toMatch(`https://www.${TEST_ROOT_DOMAIN}`);
  });

  test("random request", () => {
    // Setup ENV variables for DEV
    process.env.WEBSITE_ROOT_DOMAIN = TEST_ROOT_DOMAIN;
    process.env.CORS_ALLOW_LOCALHOST = "false";

    expect(
      ValidateCorsHost.generateAllowOriginForOrigin(emptyAllowedHosts,"http://abc-1231.de")
    ).toMatch(`https://www.${TEST_ROOT_DOMAIN}`);
  });

  test("random request DEV", () => {
    // Setup ENV variables for DEV
    process.env.WEBSITE_ROOT_DOMAIN = TEST_ROOT_DOMAIN;
    process.env.CORS_ALLOW_LOCALHOST = "true";

    expect(
      ValidateCorsHost.generateAllowOriginForOrigin(emptyAllowedHosts,"http://abc-1231.de")
    ).toMatch(`https://www.${TEST_ROOT_DOMAIN}`);
  });

  test("random subdomain", () => {
    // Setup ENV variables for DEV
    process.env.WEBSITE_ROOT_DOMAIN = TEST_ROOT_DOMAIN;
    process.env.CORS_ALLOW_LOCALHOST = "true";

    expect(
      ValidateCorsHost.generateAllowOriginForOrigin(emptyAllowedHosts,
        `https://random-sub-domain.${TEST_ROOT_DOMAIN}`
      )
    ).toMatch(`https://random-sub-domain.${TEST_ROOT_DOMAIN}`);
  });

  test("allowedHost", () => {
    // Setup ENV variables for DEV
    process.env.WEBSITE_ROOT_DOMAIN = TEST_ROOT_DOMAIN;
    process.env.CORS_ALLOW_LOCALHOST = "true";
    process.env.WEBSITE_ENVIRONMENT_STAGE = 'stage';
    const allowedHosts = {
      'stage': ['https://allowed-host-approved.de']
    }
    expect(
      ValidateCorsHost.generateAllowOriginForOrigin(allowedHosts,
        `https://allowed-host-approved.de`
      )
    ).toMatch(`https://allowed-host-approved.de`);
  });

  test("not allowedHost", () => {
    // Setup ENV variables for DEV
    process.env.WEBSITE_ROOT_DOMAIN = TEST_ROOT_DOMAIN;
    process.env.CORS_ALLOW_LOCALHOST = "true";
    process.env.WEBSITE_ENVIRONMENT_STAGE = 'stage';
    const allowedHosts = {
      'stage': ['https://allowed-host-approved.de']
    }
    expect(
      ValidateCorsHost.generateAllowOriginForOrigin(allowedHosts,
        `https://not-allowed-host-approved.de`
      )
    ).toMatch(`https://www.${TEST_ROOT_DOMAIN}`);
  });

  test("empty Origin doesn't throw error", () => {
    process.env.WEBSITE_ROOT_DOMAIN = TEST_ROOT_DOMAIN;
    expect(
      ValidateCorsHost.generateAllowOriginForOrigin({},
        undefined!
      )
    );
  });
});
