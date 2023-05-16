declare const __DEV__: boolean

declare type SFCWithInstall<T> = T & { install(app: App): void; }
