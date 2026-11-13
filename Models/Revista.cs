public class Revista : MaterialBiblioteca
{
    public int Edicao { get; set; }
    public int mesPublicacao { get; set; }

    public override int CalcularPrazo()
    {
        return 7;
    }

    public override string Descricao()
    {
        return $"Revista: {titulo} - Edição: {Edicao}";
    }
}