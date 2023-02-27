using System.Net;

namespace Project.Services.Business.Exceptions;
public class AuthenticationException : ApiExceptionBase {
    public AuthenticationException() : base(HttpStatusCode.BadRequest, "Authentication failed") {
    }

    public AuthenticationException(string message) : base(HttpStatusCode.BadRequest, message, "Authentication failed") {
    }

    public AuthenticationException(string message, Exception innerException) : base(HttpStatusCode.BadRequest, message, innerException, "Authentication failed") {
    }
}
