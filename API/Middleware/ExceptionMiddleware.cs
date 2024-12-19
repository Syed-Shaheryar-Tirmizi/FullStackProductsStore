using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private ILogger<ExceptionMiddleware> _logger;
        private RequestDelegate _delegate;
        private IHostEnvironment _enviornment;

        public ExceptionMiddleware(ILogger<ExceptionMiddleware> logger, RequestDelegate requestDelegate, IHostEnvironment environment)
        {
            _logger = logger;
            _delegate = requestDelegate;
            _enviornment = environment;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _delegate(context);
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                context.Response.ContentType = "appilcation/json";
                context.Response.StatusCode = 500;

                var response = new ProblemDetails
                {
                    Status = 500,
                    Detail = _enviornment.IsDevelopment() ? ex.StackTrace.ToString() : null,
                    Title = ex.Message
                };

                var options = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                };

                var json = JsonSerializer.Serialize(response, options);
                await context.Response.WriteAsync(json);
            }
        }
    }
}