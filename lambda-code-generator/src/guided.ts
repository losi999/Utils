import { default as inquirer } from 'inquirer';
import { components, handlerTypes } from './utils';
import { ITemplateService } from './services/template-service';
import fs from 'fs';

export const guided = (templateService: ITemplateService) => async () => {
  inquirer.registerPrompt('directory', require('inquirer-select-directory'));

  const { isNew } = await inquirer.prompt([{
    message: 'Is it a new function?',
    name: 'isNew',
    type: 'confirm',
  }]);

  if (!isNew) {
    const { functionsFolder } = await inquirer.prompt([{
      name: 'functionsFolder',
      message: 'Select the "functions" folder',
      basePath: '.',
      type: 'directory'
    }]);

    const dirs = fs.readdirSync(functionsFolder);
    console.log(dirs);

    const answers = await inquirer.prompt([
      {
        name: 'functionFolder',
        message: 'Select the folder of the function',
        basePath: '.',
        type: 'directory'
      },
      {
        name: 'components',
        message: 'Which components you want to generate?',
        type: 'checkbox',
        choices: components.map((c) => {
          return {
            name: c
          }
        })
      },
      {
        name: 'handlerType',
        message: 'Which kind of lambda is it?',
        type: 'list',
        choices: handlerTypes
      }
    ]);

    templateService.createComponents(answers);
  } else {
    const answers = await inquirer.prompt([
      {
        name: 'functionName',
        message: 'Function name',
        type: 'input',
      },
      {
        name: 'functionsFolder',
        message: 'Select the "functions" folder',
        basePath: '.',
        type: 'directory'
      },
      {
        name: 'handlerType',
        message: 'Which kind of lambda you want to generate?',
        type: 'list',
        choices: handlerTypes
      }
    ]);

    templateService.createNewFunction(answers);
  }
}