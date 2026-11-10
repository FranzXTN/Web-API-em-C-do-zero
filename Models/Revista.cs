public class Revista : MaterialBiblioteca
{
    public string? Edicao {get; set;}
    public string? mesPublicacao {get; set;}

        public override int CalcularPrazo()
    {
        return 7;
    }

        public override string Descricao()
    {
        return $"Revista: {titulo}";
    }

}