using API.Data;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly ProductContext _productContext;

        public ProductsController(ProductContext productContext)
        {
            _productContext = productContext;
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<Product>>> GetProducts([FromQuery]ProductParam productParams)
        {
            var query = _productContext.Products
                .Sort(productParams.OrderBy)
                .Search(productParams.SearchTerm)
                .Filter(productParams.Types, productParams.Brands);
            var products = await PagedList<Product>.ToPagedList(query, productParams.PageNumber, productParams.PageSize);

            Response.AddPaginatedHeader(products.MetaData);

            return products;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProductById(int id)
        {
            var product = await _productContext.Products.FindAsync(id);
            if (product is null)
            {
                return NotFound();
            }
            return product;
        }

        [HttpGet("filters")]
        public async Task<ActionResult> GetFilters()
        {
            var brands = await _productContext.Products.Select(x => x.Brand).Distinct().ToListAsync();
            var types = await _productContext.Products.Select(x => x.Type).Distinct().ToListAsync();
            return Ok(new { brands, types });
        }
    }
}