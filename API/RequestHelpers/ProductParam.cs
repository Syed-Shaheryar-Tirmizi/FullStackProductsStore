namespace API.RequestHelpers
{
    public class ProductParam : PaginationParams
    {
        public  string SearchTerm { get; set; }
        public string Types { get; set; }
        public string Brands { get; set; }
        public string OrderBy { get; set; }
    }
}