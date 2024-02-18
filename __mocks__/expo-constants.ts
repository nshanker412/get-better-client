/**
 * A mock of the Constants module with extra fields specified to simulate a project in development.
 * Use it by importing and returning it from a `jest.mock` call explicitly.
 */

const Constants = jest.requireActual('expo-constants');

const MockConstants = {
    ...Constants,
    expoConfig: {
        ...Constants.expoConfig,
        extra: {
            eas: {
                projectId: 'mockedProjectId',
            },
        },
    },
    };


module.exports = MockConstants;