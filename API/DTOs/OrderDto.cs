using API.Entities.OrderAggregate;

namespace API.DTOs
{
    public class OrderDto
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }
        public ShippingAddress ShippingAddress { get; set; }
        public DateTime OrderDate { get; set; }
        public List<OrderItemDto> Items { get; set; }
        public long SubTotal { get; set; }
        public long DeliveryFee { get; set; }
        public string Status { get; set; }
        public long Total { get; set; }
    }
}