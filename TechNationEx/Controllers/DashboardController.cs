using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using TechNationEx.Data;
using TechNationEx.Models;

namespace TechNationEx.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly FiscalDbContext _context;

        public DashboardController(FiscalDbContext context)
        {
            _context = context;
        }

        // GET api/dashboard/indicadores
        [HttpGet("indicadores")]
        public async Task<IActionResult> GetIndicadores()
        {
            try
            {
                var totalNotasEmitidas = await _context.NotaFiscal.SumAsync(n => n.Valor);
                var totalSemCobrança = await _context.NotaFiscal
                    .Where(n => n.DataCobranca == null)
                    .SumAsync(n => n.Valor);
                var totalInadimplente = await _context.NotaFiscal
                    .Where(n => n.DataPagamento == null && n.DataCobranca != null && n.DataCobranca < DateTime.Now)
                    .SumAsync(n => n.Valor);
                var totalAVencer = await _context.NotaFiscal
                    .Where(n => n.DataPagamento == null && n.DataCobranca != null && n.DataCobranca >= DateTime.Now)
                    .SumAsync(n => n.Valor);
                var totalPagas = await _context.NotaFiscal
                    .Where(n => n.DataPagamento != null)
                    .SumAsync(n => n.Valor);

                return Ok(new
                {
                    TotalNotasEmitidas = totalNotasEmitidas,
                    TotalSemCobrança = totalSemCobrança,
                    TotalInadimplente = totalInadimplente,
                    TotalAVencer = totalAVencer,
                    TotalPagas = totalPagas
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET api/dashboard/grafico
        [HttpGet("grafico")]
        public async Task<IActionResult> GetGraficos(int? ano, int? trimestre, int? mes)
        {
            try
            {
                var query = _context.NotaFiscal.AsQueryable();

                if (ano.HasValue)
                {
                    query = query.Where(n => n.DataCobranca.HasValue && n.DataCobranca.Value.Year == ano.Value);
                }

                if (trimestre.HasValue)
                {
                    var startMonth = (trimestre.Value - 1) * 3 + 1;
                    var endMonth = startMonth + 2;
                    query = query.Where(n => n.DataCobranca.HasValue && n.DataCobranca.Value.Month >= startMonth && n.DataCobranca.Value.Month <= endMonth);
                }

                if (mes.HasValue)
                {
                    query = query.Where(n => n.DataCobranca.HasValue && n.DataCobranca.Value.Month == mes.Value);
                }

                var inadimplenciaMensal = await query
                    .Where(n => n.DataCobranca.HasValue && n.DataPagamento == null && n.DataCobranca < DateTime.Now)
                    .GroupBy(n => new { n.DataCobranca.Value.Year, n.DataCobranca.Value.Month })
                    .Select(g => new GraficoDto
                    {
                        Mes = $"{g.Key.Month}/{g.Key.Year}",
                        Valor = g.Sum(n => n.Valor)
                    })
                    .ToListAsync();

                var receitaMensal = await query
                    .Where(n => n.DataPagamento.HasValue)
                    .GroupBy(n => new { n.DataPagamento.Value.Year, n.DataPagamento.Value.Month })
                    .Select(g => new GraficoDto
                    {
                        Mes = $"{g.Key.Month}/{g.Key.Year}",
                        Valor = g.Sum(n => n.Valor)
                    })
                    .ToListAsync();

                return Ok(new
                {
                    InadimplenciaMensal = inadimplenciaMensal,
                    ReceitaMensal = receitaMensal
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

      
    }
}
