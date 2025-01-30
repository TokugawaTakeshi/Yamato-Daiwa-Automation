export type VoidPromiseReturningFunction = () => Promise<void>;

export const voidPromiseReturningFunction: VoidPromiseReturningFunction = async (): Promise<void> => Promise.resolve();
