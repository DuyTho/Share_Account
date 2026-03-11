module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/__mock__/prisma.ts'],
  moduleNameMapper: {
    '^uuid$': '<rootDir>/src/__mock__/uuid.ts',
  },
};