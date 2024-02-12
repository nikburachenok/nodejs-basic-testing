import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import fs from 'fs';
import path from 'path';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should set timeout with provided callback and timeout', () => {
    const mockFn = jest.fn();
    jest.spyOn(global, 'setTimeout');
    doStuffByTimeout(mockFn, 1000);
    expect(setTimeout).toBeCalledWith(mockFn, 1000);
  });

  test('should call callback only after timeout', () => {
    const mockFn = jest.fn();
    doStuffByTimeout(mockFn, 100);
    expect(mockFn).not.toBeCalled();
    jest.advanceTimersByTime(1000);
    expect(mockFn).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const mockFn = jest.fn();
    const spy = jest.spyOn(global, 'setInterval');
    doStuffByInterval(mockFn, 1000);
    expect(spy).toHaveBeenCalledWith(mockFn, 1000);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 1000);
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(2);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const pathToFile = 'example.txt';
    jest.spyOn(path, 'join').mockReturnValue(`test`);
    await readFileAsynchronously(pathToFile);
    expect(path.join).toHaveBeenCalledWith(
      expect.stringContaining(__dirname),
      expect.stringContaining(pathToFile),
    );
  });

  test('should return null if file does not exist', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    expect(await readFileAsynchronously('example.txt')).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const fileContent = 'Mock content';
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest
      .spyOn(fs.promises, 'readFile')
      .mockResolvedValue(Buffer.from(fileContent));
    expect(await readFileAsynchronously('example.txt')).toBe(fileContent);
  });
});
