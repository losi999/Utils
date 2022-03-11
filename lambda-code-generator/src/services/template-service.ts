import { ComponentType, HandlerType, keys } from '../utils';
import fs from 'fs';
import { camelCase, paramCase, pascalCase, sentenceCase } from 'change-case';
import path from 'path';

export interface ITemplateService {
  createNewFunction(config: {
    functionName: string;
    handlerType: HandlerType;
    functionsFolder: string
  }): void;
  createComponents(config: {
    functionFolder: string,
    components: ComponentType[],
    handlerType: HandlerType
  }): void;
}

export const templateServiceFactory = (): ITemplateService => {
  const componentSuffixMap: { [component in ComponentType]: string } = {
    businessService: '.service.ts',
    handler: '.handler.ts',
    businessServiceUnitTest: '.service.spec.ts',
    handlerUnitTest: '.handler.spec.ts',
    index: '.index.ts',
  };

  const handlerTypeFilesMap: { [h in HandlerType]: {
    [component in ComponentType]: string;
  }; } = {
    api: {
      businessService: 'business-service.template',
      businessServiceUnitTest: 'business-service-test.template',
      handler: 'lambda-handler-api.template',
      handlerUnitTest: 'lambda-handler-test.template',
      index: 'index-api.template',
    },
    sns: {
      businessService: 'business-service.template',
      businessServiceUnitTest: 'business-service-test.template',
      handler: 'lambda-handler-sns.template',
      handlerUnitTest: 'lambda-handler-test.template',
      index: 'index.template',
    },
    dynamodb: {
      businessService: 'business-service.template',
      businessServiceUnitTest: 'business-service-test.template',
      handler: 'lambda-handler-dynamodb.template',
      handlerUnitTest: 'lambda-handler-test.template',
      index: 'index.template',
    },
    sqs: {
      businessService: 'business-service.template',
      businessServiceUnitTest: 'business-service-test.template',
      handler: 'lambda-handler-sqs.template',
      handlerUnitTest: 'lambda-handler-test.template',
      index: 'index.template',
    },
    scheduled: {
      businessService: 'business-service.template',
      businessServiceUnitTest: 'business-service-test.template',
      handler: 'lambda-handler-scheduled.template',
      handlerUnitTest: 'lambda-handler-test.template',
      index: 'index.template',
    },
    plain: {
      businessService: 'business-service.template',
      businessServiceUnitTest: 'business-service-test.template',
      handler: 'lambda-handler-plain.template',
      handlerUnitTest: 'lambda-handler-test.template',
      index: 'index.template',
    },
  };

  return {
    createNewFunction: ({ functionName, functionsFolder, handlerType }) => {
      const camelCaseReplacement = camelCase(functionName);
      const paramCaseReplacement = paramCase(functionName);
      const pascalCaseReplacement = pascalCase(functionName);
      const sentenceCaseReplacement = sentenceCase(functionName);

      const replacementNames = {
        '%camelCase%': camelCaseReplacement,
        '%paramCase%': paramCaseReplacement,
        '%pascalCase%': pascalCaseReplacement,
        '%sentenceCase%': sentenceCaseReplacement,
      };

      const regexp = new RegExp(Object.keys(replacementNames).join("|"), "gi");
      const functionFolder = path.join(functionsFolder, paramCaseReplacement);

      if (!fs.existsSync(functionFolder)) {
        fs.mkdirSync(functionFolder);
      }

      keys(handlerTypeFilesMap[handlerType]).forEach(component => {
        const template = fs.readFileSync(path.join('src', 'templates', handlerTypeFilesMap[handlerType][component]), { encoding: 'utf-8' });
        const replaced = template.replace(regexp, (matched: keyof typeof replacementNames) => {
          return replacementNames[matched];
        });

        const generatedFileName = path.join(functionFolder, `${paramCaseReplacement}${componentSuffixMap[component]}`);
        fs.writeFileSync(generatedFileName, replaced, { encoding: 'utf-8' });
        console.log('File generated at', generatedFileName);
      });
    },
    createComponents: ({ components, functionFolder, handlerType }) => {
      const functionName = path.basename(functionFolder)

      const camelCaseReplacement = camelCase(functionName);
      const paramCaseReplacement = paramCase(functionName);
      const pascalCaseReplacement = pascalCase(functionName);
      const sentenceCaseReplacement = sentenceCase(functionName);

      const replacementNames = {
        '%camelCase%': camelCaseReplacement,
        '%paramCase%': paramCaseReplacement,
        '%pascalCase%': pascalCaseReplacement,
        '%sentenceCase%': sentenceCaseReplacement,
      };

      const regexp = new RegExp(Object.keys(replacementNames).join("|"), "gi");

      components.forEach((component) => {
        const template = fs.readFileSync(path.join('src', 'templates', handlerTypeFilesMap[handlerType][component]), { encoding: 'utf-8' });
        const replaced = template.replace(regexp, (matched: keyof typeof replacementNames) => {
          return replacementNames[matched];
        });

        const generatedFileName = path.join(functionFolder, `${paramCaseReplacement}${componentSuffixMap[component]}`);
        fs.writeFileSync(generatedFileName, replaced, { encoding: 'utf-8' });
        console.log('File generated at', generatedFileName);
      })
    }
  };
};