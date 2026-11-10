public abstract class MaterialBiblioteca {
    public int Id {get; init;}
    public string? titulo {get; set;}
    public int anoPublicacao {get; set;}

    public abstract int CalcularPrazo();

    public virtual string Descricao()
    {
        return "Este livro está disponivel";
    }
}