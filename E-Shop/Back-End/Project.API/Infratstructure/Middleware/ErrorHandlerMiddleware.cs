using System.Text.Json;
using System.Net;
using Project.Services.Business.Exceptions;

namespace Project.API.Infrastructure.Middleware;

public class ErrorHandlerMiddleware {
    private readonly RequestDelegate _next;

    public ErrorHandlerMiddleware(RequestDelegate next) {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context) {
        try {
            await _next(context);
        }
        catch (Exception exception) {
            var response = context.Response;
            response.ContentType = "application/json";

            switch (exception) {
                case ModelNotFoundException e:
                    response.StatusCode = (int)HttpStatusCode.NotFound;
                    break;
                case AuthenticationException e:
                    response.StatusCode = (int)HttpStatusCode.BadRequest;
                    break;
                case PasswordException e:
                    response.StatusCode = (int)HttpStatusCode.Conflict;
                    break;
                case AlreadyExistsException e:
                    response.StatusCode = (int)HttpStatusCode.Conflict;
                    break;
                default:
                    response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    break;
            }

            var result = JsonSerializer.Serialize(new { message = exception?.Message });
            await response.WriteAsync(result);
        }
    }
}
