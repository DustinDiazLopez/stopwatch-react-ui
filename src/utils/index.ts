import clasico from 'clasico';
import {AnyFn} from "clasico/lib/@types";

export type KeyValue = {
  key: string,
  value: unknown,
};

export function isTrue(x: unknown) {
  return clasico.check.isTrue(x);
}

export function evaluate(
  expression: string,
  functions?: KeyValue[],
  variables?: KeyValue[],
) {
  const parser = new clasico.template.TemplateParser({
    includeBuiltIns: true,
  });

  variables?.forEach(({key, value}) => {
    parser.addVar(key, value);
  });

  functions?.forEach(({key, value}) => {
    parser.addFunction(key, value as AnyFn);
  });

  return parser.parse(expression);
}

export function formatTime(time: number, len = 2) {
  return time.toString().padStart(len, '0');
}

export function updateStopwatchDisplay(ms: number, showMs = true) {
  const milliseconds = ms % 1000;
  const seconds = Math.floor(ms / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  const msPart = showMs ? `.${formatTime(milliseconds, 3)}` : '';
  return `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(remainingSeconds)}` + msPart;
}
