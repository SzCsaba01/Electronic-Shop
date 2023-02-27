using Project.Services.Business;
using Project.Services.Contracts;

namespace Project.API.Infratstructure;

public static class ServiceExtensions {
    public static IServiceCollection RegisterServices(this IServiceCollection services) {
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IEncryptionService, EncryptionService>();
        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<IAuthenticationService, AuthenticationService>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<IProductService, ProductService>();

        services.AddCors(options => options.AddPolicy(
            name: "NgOrigins",
            policy => {
                policy.WithOrigins("http://localhost:4200").AllowAnyMethod().AllowAnyHeader();
            }));

        return services;
    }
}
