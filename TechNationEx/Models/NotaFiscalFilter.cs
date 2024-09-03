using TechNationEx.Enum;

namespace TechNationEx.Models
{

    public class NotaFiscalFilter
    {
        public int? MesEmissao { get; set; }
        public int? MesCobranca { get; set; }
        public int? MesPagamento { get; set; }
        public StatusNotaFiscal? Status { get; set; }
    }
}
