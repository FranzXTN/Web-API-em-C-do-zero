public class Livro : MaterialBiblioteca, IEmprestimo
{
    public string? autor { get; set; }
    public int paginas { get; set; }

    public override int CalcularPrazo()
    {
        return 14;
    }

    public override string Descricao()
    {
        return $"Livro: {titulo} - Autor: {autor}";
    }

    public string Emprestar()
    {
        return $"O livro '{titulo}' pode ser emprestado por {CalcularPrazo()} dias.";
    }
}