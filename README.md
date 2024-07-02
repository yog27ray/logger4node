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
3. Create logger instance.
    ```ts
    const loggerInstance = applicationLogger.instance('Instance1');
    ```
4. Log information
    ```ts
    loggerInstance.error('This is test log');
    ```
   Output:
    ```text
    Error: Application:Instance1 This is test log
    ```

## Configuration:

1. **JSON Logs**: JSON logging is recommended for production deployments as it provides more detailed information.
   JSON logs include fields such as `time`, `source`, `request`, `extraData`, and `stack`.

   To enable JSON logging, use the following configuration:
   ```ts
   applicationLogger.setJsonLogging(true);
   .
   .
   .
   loggerInstance.error('This is test log');
   ```
   Output:
   ```text
   {
      "level": "error",
      "time": "2024-07-01T07:07:54.877Z",
      "className": "Application:Instance1",
      "source": {
      "caller": "callerFunctionName",
      "fileName": "fileName.ts",
      "path": "file path",
      "line": "13",
      "column": "10"
      },
      "message": "This is a test log",
      "request": {},
      "extra": {},
      "stack": ""
   }
   ```
   This format ensures that logs contain comprehensive information, making it easier to debug and monitor applications in production environments.


2. **Github Link**: This feature enhances the logging library by providing a direct GitHub link that redirects to the
   exact location in the code where the log is generated. This allows users to easily navigate the entire codebase from the logs.
   ```ts
   const applicationLogger = new Logger4Node(
    'Application',
    {
      github: {
        org: 'yog27ray',
        repo: 'logger4node',
        commitHash: 'githubCommitHash',
        basePath: 'project/root/path'
      },
    });
   ```
   1. commitHash: The specific commit hash of the code.
   2. org: The GitHub organization name.
   3. repo: The name of the repository.
   4. AbasePath: The absolute path to the root folder of the project.
   
   By configuring these parameters, the logger will generate links that point to the exact lines in the GitHub repository, simplifying code navigation and debugging.


3. **Multiple Logging Patter**: This feature allows you to set different log severities for different instances of the logger.
   ```ts
   applicationLogger.setLogLevel(LogSeverity.ERROR);
   applicationLogger.setLogPattern('Application:*');
   
   applicationLogger.setLogSeverityPattern(LogSeverity.INFO, 'Application:Instance1,Application:Instance2');
   applicationLogger.setLogSeverityPattern(LogSeverity.DEBUG, 'Application:Instance3');
   ```
   In the example above:

   1. The default logging level is set to ERROR for all application logs.
   2. For the logger instances Instance1 and Instance2, logs will include INFO level messages.
   3. For the logger instance Instance3, logs will include DEBUG level messages.
   
   This setup enables more granular control over logging by specifying different severity levels for specific logger instances.


4. **Track Session Log**: Often, it’s useful to track all logs that correspond to a single session to better understand
   the code flow. You can also pass additional information to be preserved throughout the session. Below is the 
   configuration to enable this feature:
   1. With Express Server:
      ```ts
      app.use(Logger4Node.Trace.requestHandler((req: Request) => {
         const sessionInformation = { user: 'userId' };
         return sessionInformation;
      }));
      .
      .
      .
      loggerInstance.error('This is test log');
      ```
      After enabling this configuration, every log will include `request.id` and `sessionInformation` in the request object.
      This helps track all logs generated by an HTTP call.

      Example Output:
      ```json
      {
         "level": "error",
         "time": "2024-07-01T07:07:54.877Z",
         "className": "Application:Instance1",
         "source": {
         "caller": "callerFunctionName",
         "fileName": "fileName.ts",
         "path": "file path",
         "line": "13",
         "column": "10"
         },
         "message": "This is a test log",
         "request": {
            "id": "a15e7fc5-46b2-417d-9523-37a7c4dd467e",
            "user": "userId"
         },
         "extra": {},
         "stack": ""
      }
      ```

   3. Without Express Server: You can also start a new session wherever you need it in your application.
      ```ts
      Logger4Node.Trace.startNewRequest(() => {
          // your application logic
      }, { user: 'userId' });
      ```
