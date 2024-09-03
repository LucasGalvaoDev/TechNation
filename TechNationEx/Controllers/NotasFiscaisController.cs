using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TechNationEx.Data;
using TechNationEx.Enum;
using TechNationEx.Models;
using Microsoft.Extensions.Logging;

namespace TechNationEx.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotasFiscaisController : ControllerBase
    {
        private readonly FiscalDbContext _context;
        private readonly ILogger<NotasFiscaisController> _logger;

        public NotasFiscaisController(FiscalDbContext context, ILogger<NotasFiscaisController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET api/notasfiscais
        [HttpGet]
        public async Task<IActionResult> GetNotasFiscais()
        {
            var notasFiscais = await _context.NotaFiscal.ToListAsync();
            return Ok(notasFiscais);
        }

        // GET api/notasfiscais/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetNotaFiscal(int id)
        {
            var notaFiscal = await _context.NotaFiscal.FindAsync(id);
            if (notaFiscal == null)
            {
                return NotFound();
            }
            return Ok(notaFiscal);
        }

        // POST api/notasfiscais
        [HttpPost]
        public async Task<IActionResult> CreateNotaFiscal([FromBody] NotaFiscal notaFiscal)
        {
            if (notaFiscal == null)
            {
                _logger.LogWarning("Tentativa de criar uma nota fiscal nula.");
                return BadRequest("Nota Fiscal não pode ser nula.");
            }

            try
            {
                _context.NotaFiscal.Add(notaFiscal);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetNotaFiscal), new { id = notaFiscal.Id }, notaFiscal);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao criar uma nota fiscal.");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT api/notasfiscais/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNotaFiscal(int id, [FromBody] NotaFiscal notaFiscal)
        {
            if (id != notaFiscal.Id)
            {
                return BadRequest();
            }

            _context.Entry(notaFiscal).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NotaFiscalExists(id))
                {
                    return NotFound();
                }
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao atualizar a nota fiscal com ID {Id}.", id);
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

            return NoContent();
        }

        // DELETE api/notasfiscais/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotaFiscal(int id)
        {
            var notaFiscal = await _context.NotaFiscal.FindAsync(id);
            if (notaFiscal == null)
            {
                return NotFound();
            }

            try
            {
                _context.NotaFiscal.Remove(notaFiscal);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao deletar a nota fiscal com ID {Id}.", id);
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET api/notasfiscais/filtradas
        [HttpGet("filtradas")]
        public async Task<IActionResult> GetNotasFiscaisFiltradas(
        [FromQuery] int? MesEmissao,
        [FromQuery] int? AnoEmissao,
        [FromQuery] int? Status,
        [FromQuery] int pagina = 1,
        [FromQuery] int tamanhoPagina = 10)
        {
            var notasFiscais = _context.NotaFiscal.AsQueryable();

            if (MesEmissao.HasValue)
            {
                notasFiscais = notasFiscais.Where(nf => nf.DataEmissao.Month == MesEmissao.Value);
            }

            if (AnoEmissao.HasValue)
            {
                notasFiscais = notasFiscais.Where(nf => nf.DataEmissao.Year == AnoEmissao.Value);
            }

            if (Status.HasValue)
            {
                notasFiscais = notasFiscais.Where(nf => nf.Status == (StatusNotaFiscal)Status.Value);
            }

            var totalCount = await notasFiscais.CountAsync();

            if (totalCount == 0 || (pagina - 1) * tamanhoPagina >= totalCount)
            {
                return Ok(new { TotalCount = totalCount, Items = new List<NotaFiscal>() });
            }

            var resultado = await notasFiscais.Skip((pagina - 1) * tamanhoPagina).Take(tamanhoPagina).ToListAsync();

            var notasFiscaisDto = resultado.Select(nota => new NotaFiscalDto
            {
                Id = nota.Id,
                NomePagador = nota.NomePagador,
                NumeroIdentificacao = nota.NumeroIdentificacao,
                DataEmissao = nota.DataEmissao.ToString("dd/MM/yyyy"),
                DataCobranca = nota.DataCobranca?.ToString("dd/MM/yyyy"),
                DataPagamento = nota.DataPagamento?.ToString("dd/MM/yyyy"),
                Valor = nota.Valor,
                Status = (int)nota.Status
            }).ToList();

            return Ok(new { TotalCount = totalCount, Items = notasFiscaisDto });
        }

        private bool NotaFiscalExists(int id)
        {
            return _context.NotaFiscal.Any(e => e.Id == id);
        }
    }
}
