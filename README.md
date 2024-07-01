![build](https://github.com/yog27ray/logger4node/actions/workflows/node.js.yml/badge.svg?branch=master)
[![codecov](https://codecov.io/gh/yog27ray/logger4node/branch/master/graph/badge.svg)](https://codecov.io/gh/yog27ray/logger4node)

## Logger for Node

`logger4node` is a simple and flexible logging library for Node.js applications.
It allows you to log messages with different levels of severity, and you can set different severity levels for different project files

## Setup:
1. Create Application Logger.
    ```ts
    import { Logger4Node } from 'logger4node';
    
    const applicationLogger = new Logger4Node('Application');
    ```
2. Set log pattern and default log level.
   ```ts
   import { LogSeverity } from 'logger4node';
   
   applicationLogger.setLogLevel(LogSeverity.ERROR);
   applicationLogger.setLogPattern('Application:*');
   ```
3. Create file level logger.
    ```ts
    const fileLogger = applicationLogger.instance('File1');
    ```
4. Log information
    ```ts
    fileLogger.error('This is test log');
    ```
   Output:
    ```text
    Error: Application:File1 This is test log
    ```

## Configuration:

1. **JSON Logs**: Logging in json provide more information and is recommended for production deployments.
   Json logging provide `time`, `source`, `request`, `extraData`, `stack`.
   ```ts
   applicationLogger.setJsonLogging(true);
   .
   .
   .
   fileLogger.error('This is test log');
   ```
   Output:
   ```text
   {"level":"error","time":"2024-07-01T07:07:54.877Z","className":"Application:File1","source":{"caller":"callerFunctionName","fileName":"fileName.ts","path":"file path","line":"13","column":"10"},"message":"This is test log","request":{},"extra":{},"stack":""}
   ```
