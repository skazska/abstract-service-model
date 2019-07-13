# abstract-service-model

## Concept

1. request -> `io.handler` invocation
2. `io.handler` invokes sequentaly:
    * `authenticator.identify` with extracted tokens, (abstract method `authTokens` should implement 
        auth tokens extraction from Input data) if `authenticator` is provided for `io`
    * `executable.run` with extracted data (abstract method `data` should implement data extraction 
        from Input data)
    * return Promise with `fail` method result if `identify` or `run` method return error, `success` 
        method success otherwise
 
3. `executable.run` invokes:
    * `_authenticate` method if `identity` is provided for `run` where `identity` gets asked to check 
        for realm and operation configured for executable (`_authenticate` method could be reimplemented)
    * `_execute` method - abstract, should implement actual logic.
    

