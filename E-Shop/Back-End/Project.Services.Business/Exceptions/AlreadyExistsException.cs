using System.Net;

namespace Project.Services.Business.Exceptions;
public class AlreadyExistsException : ApiExceptionBase {

    public AlreadyExistsException() : base(HttpStatusCode.Conflict, "Already exists") { }

    public AlreadyExistsException(string message) : base(HttpStatusCode.Conflict, message, "Already exists") {
    }

    public AlreadyExistsException(string message, Exception innerException) : base(HttpStatusCode.Conflict, message, innerException, "Already exists") {
    }
}