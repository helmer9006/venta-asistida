import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  bail: 1,
  transformIgnorePatterns: ["/node_modules/"],
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ['**/test/**/*.service.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
  collectCoverage: true,
  testTimeout: 90000,
  collectCoverageFrom: [
    //"**/*.service.(t|j)s",
    "src/**/*.service.(t|j)s",
    "!coverage/**",
    "!dist/**",
    "!**/unleash.*.(t|j)s",
    "!**/prisma.*.(t|j)s",
    "!**/redis.*.(t|j)s",
    "!**/*-provider.service.(t|j)s",  
    "!**/node_modules/**",
  ],
  coverageDirectory: "coverage",
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  maxConcurrency: 5,
  moduleNameMapper: {
    "@src/(.*)": "<rootDir>/src/$1",
    "@shared/(.*)": "<rootDir>/src/shared/$1",
    "@test/(.*)": "<rootDir>/test/$1"
  },
  // setupFiles: ["test/utils/singleton.ts"],
  // setupFilesAfterEnv: ["test/utils/singleton.ts"],
};

export default config;