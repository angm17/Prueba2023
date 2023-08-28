namespace PracticaPrueba.Models
{
    public class Cabecera
    {
        public int Id { get; set; }
        public float Subtotal { get; set; }
        public float BaseIva{ get; set; }
        public float Base0 { get; set; }
        public float Impuesto { get; set; }
        public float Total { get; set; }

        public List<Detalle> Detalles { get; set;} = new List<Detalle>();

    }
}
