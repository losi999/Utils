export const handlerTypes = ['api', 'sns', 'dynamodb', 'plain', 'sqs', 'scheduled'] as const;
export const components = ['businessService', 'businessServiceUnitTest', 'handler', 'handlerUnitTest', 'index'] as const;
export const keys = <T>(obj: T): (keyof T)[] => {
    return Object.keys(obj) as (keyof T)[];
};

export type HandlerType = typeof handlerTypes[number];
export type ComponentType = typeof components[number];
export type TemplateName = 'business-service' | 'index-api' | 'index' | `lambda-handler-${HandlerType}` | 'business-service-test' | 'lambda-handler-test';