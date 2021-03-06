module.exports = {
  roots: ["<rootDir>/src"],
  testMatch: [
    "**/__tests__/?(*.)+(spec|test).+(ts|tsx)",
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};