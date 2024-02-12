import {
  getBankAccount,
  BankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from '.';
import lodash from 'lodash';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    expect(getBankAccount(100)).toEqual(new BankAccount(100));
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => getBankAccount(100).withdraw(150)).toThrowError(
      new InsufficientFundsError(100),
    );
  });

  test('should throw error when transferring more than balance', () => {
    const fromAccount: BankAccount = getBankAccount(100);
    const toAccount: BankAccount = getBankAccount(50);
    expect(() => fromAccount.transfer(150, toAccount)).toThrowError(
      new InsufficientFundsError(100),
    );
    expect(toAccount.getBalance()).toBe(50);
  });

  test('should throw error when transferring to the same account', () => {
    const account: BankAccount = getBankAccount(100);
    expect(() => account.transfer(50, account)).toThrowError(
      new TransferFailedError(),
    );
    expect(account.getBalance()).toBe(100);
  });

  test('should deposit money', () => {
    expect(getBankAccount(100).deposit(50).getBalance()).toBe(150);

    // The sum of 0.1 and 0.2 it is exception. Some more information here https://habr.com/ru/articles/541816/.
    // To test this sum it is better to use toBeCloseTo() method.
    expect(getBankAccount(0.1).deposit(0.2).getBalance()).toBeCloseTo(0.3, 15);
  });

  test('should withdraw money', () => {
    expect(getBankAccount(100).withdraw(50).getBalance()).toBe(50);
  });

  test('should transfer money', () => {
    const fromAccount: BankAccount = getBankAccount(100);
    const toAccount: BankAccount = getBankAccount(50);
    expect(fromAccount.transfer(10, toAccount).getBalance()).toBe(90);
    expect(toAccount.getBalance()).toBe(60);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    jest.spyOn(lodash, 'random').mockReturnValue(0);
    expect(await getBankAccount(100).fetchBalance()).toBe(null);

    jest.spyOn(lodash, 'random').mockReturnValue(42);
    expect(await getBankAccount(100).fetchBalance()).toBe(42);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    jest.spyOn(lodash, 'random').mockReturnValue(42);
    const account: BankAccount = getBankAccount(150);
    expect(account.getBalance()).toBe(150);

    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(42);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(lodash, 'random').mockReturnValue(0);
    const account: BankAccount = getBankAccount(150);
    expect(account.getBalance()).toBe(150);

    expect(account.synchronizeBalance()).rejects.toEqual(
      new SynchronizationFailedError(),
    );
  });
});
