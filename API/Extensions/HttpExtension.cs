using System.Text.Json;
using API.RequestHelpers;

namespace API.Extensions
{
    public static class HttpExtension
    {
        public static void AddPaginatedHeader(this HttpResponse response, MetaData metaData)
        {
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };
            var json = JsonSerializer.Serialize(metaData, options);
            response.Headers.Add("Pagination", json);
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
    }
}