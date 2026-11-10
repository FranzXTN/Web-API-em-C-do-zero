public class Livro : MaterialBiblioteca, IEmprestimo
{
    public string? autor {get; set;}
    public int paginas {get; set;}
    public int prazoDias {get;set;}

    public override int CalcularPrazo()
    {
        return 14;
    }

    public override string Descricao()
    {
        return $"Livro: {titulo}";
    }

    public double Emprestimo(double novoEmprestimo)
    {
        this.prazoDias = CalcularPrazo();
        return novoEmprestimo;
    }
}