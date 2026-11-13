public abstract class MaterialBiblioteca
{
    public int Id { get; set; }
    public string? titulo { get; set; }
    public int anoPublicacao { get; set; }

    public string Tipo => GetType().Name;

    public abstract int CalcularPrazo();

    public virtual string Descricao()
    {
        return $"Material: {titulo}";
    }
}