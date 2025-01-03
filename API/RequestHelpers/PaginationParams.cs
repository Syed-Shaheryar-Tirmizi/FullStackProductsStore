namespace API.RequestHelpers
{
    public class PaginationParams
    {
        public int PageNumber { get; set; } = 1;
        public const int MaxPageSize = 50;
        private int _pageSize = 6;
        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = value > MaxPageSize ? MaxPageSize : value;
        }
    }
}