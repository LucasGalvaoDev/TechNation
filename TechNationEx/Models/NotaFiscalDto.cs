namespace TechNationEx.Models
{
    public class NotaFiscalDto
    {
        public int Id { get; set; }
        public string NomePagador { get; set; }
        public string NumeroIdentificacao { get; set; }
        public string DataEmissao { get; set; }
        public string DataCobranca { get; set; }
        public string DataPagamento { get; set; }
        public decimal Valor { get; set; }
        public int Status { get; set; }
    }

}
