import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsNotOlderThanToday(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsNotOlderThanToday',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          const today = new Date();
          const delayedDate = new Date(value);

          return today.valueOf() <= delayedDate.valueOf();
        },
      },
    });
  };
}
