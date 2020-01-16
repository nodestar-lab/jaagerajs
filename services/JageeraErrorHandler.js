class JageeraErrorHandler {
    constructor(config, jr) {
        this.config = config;
        this.jr = jr;
        logger.info("[*JageeraErrorHandler] ")
    }

    intialize() {}

    handleError(err, req, res) {
        logger.error("insidet the jageera error handler : ");
        logger.error(`${err}`);
        let error = {
            message: err.message,
            name: err.name,
            stack: err.stack, // remove stack in production environment ; 
            code: 400,
            description: ""
        }
        res.send({
            error: error
        });
    }

    getCodeMessage(code) {
        let errorCodes = {
            200: "OK",
            400: "Bad Request",
            401: "Unauthorized",
            403: "Forbidden",
            404: "Not Found",
            405: "Method Not Allowed",
            406: "Not Acceptable",
            412: "Precondition Failed",
            415: "Unsupported Media Type",
            500: "Internal Server Error",
            501: "Not Implemented"
        }
        return errorCodes[code];
    }

    // define deferent error and their codes 

}


module.exports = JageeraErrorHandler;

/* 
    200 (OK)
    It indicates that the REST API successfully carried out whatever action the client requested and that no more specific code in the 2xx series is appropriate.
    Unlike the 204 status code, a 200 response should include a response body.The information returned with the response is dependent on the method used in the request, for example:


    400 (Bad Request)
    400 is the generic client-side error status, used when no other 4xx error code is appropriate. Errors can be like malformed request syntax, invalid request message parameters, or deceptive request routing etc.

    The client SHOULD NOT repeat the request without modifications.


    401 (Unauthorized)
    A 401 error response indicates that the client tried to operate on a protected resource without providing the proper authorization. It may have provided the wrong credentials or none at all. The response must include a WWW-Authenticate header field containing a challenge applicable to the requested resource.

    The client MAY repeat the request with a suitable Authorization header field. If the request already included Authorization credentials, then the 401 response indicates that authorization has been refused for those credentials. If the 401 response contains the same challenge as the prior response, and the user agent has already attempted authentication at least once, then the user SHOULD be presented the entity that was given in the response, since that entity might include relevant diagnostic information.


    403 (Forbidden)
    A 403 error response indicates that the client’s request is formed correctly, but the REST API refuses to honor it, i.e. the user does not have the necessary permissions for the resource. A 403 response is not a case of insufficient client credentials; that would be 401 (“Unauthorized”).

    Authentication will not help, and the request SHOULD NOT be repeated. Unlike a 401 Unauthorized response, authenticating will make no difference.


    404 (Not Found)
    The 404 error status code indicates that the REST API can’t map the client’s URI to a resource but may be available in the future. Subsequent requests by the client are permissible.

    No indication is given of whether the condition is temporary or permanent. The 410 (Gone) status code SHOULD be used if the server knows, through some internally configurable mechanism, that an old resource is permanently unavailable and has no forwarding address. This status code is commonly used when the server does not wish to reveal exactly why the request has been refused, or when no other response is applicable.


    405 (Method Not Allowed)
    The API responds with a 405 error to indicate that the client tried to use an HTTP method that the resource does not allow. For instance, a read-only resource could support only GET and HEAD, while a controller resource might allow GET and POST, but not PUT or DELETE.

    A 405 response must include the Allow header, which lists the HTTP methods that the resource supports. For example:

    Allow: GET, POST

    406 (Not Acceptable)
    The 406 error response indicates that the API is not able to generate any of the client’s preferred media types, as indicated by the Accept request header. For example, a client request for data formatted as application/xml will receive a 406 response if the API is only willing to format data as application/json.

    If the response could be unacceptable, a user agent SHOULD temporarily stop receipt of more data and query the user for a decision on further actions.


    412 (Precondition Failed)
    The 412 error response indicates that the client specified one or more preconditions in its request headers, effectively telling the REST API to carry out its request only if certain conditions were met. A 412 response indicates that those conditions were not met, so instead of carrying out the request, the API sends this status code.


    415 (Unsupported Media Type)
    The 415 error response indicates that the API is not able to process the client’s supplied media type, as indicated by the Content-Type request header. For example, a client request including data formatted as application/xml will receive a 415 response if the API is only willing to process data formatted as application/json.

    For example, the client uploads an image as image/svg+xml, but the server requires that images use a different format.


    500 (Internal Server Error)
    500 is the generic REST API error response. Most web frameworks automatically respond with this response status code whenever they execute some request handler code that raises an exception.

    A 500 error is never the client’s fault, and therefore, it is reasonable for the client to retry the same request that triggered this response and hope to get a different response.

    API response is the generic error message, given when an unexpected condition was encountered and no more specific message is suitable.


    501 (Not Implemented)
    The server either does not recognize the request method, or it lacks the ability to fulfill the request. Usually, this implies future availability (e.g., a new feature of a web-service API).


*/